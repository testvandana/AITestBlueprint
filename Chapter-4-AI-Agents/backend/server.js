const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');

// Vercel serverless compatible fallback
dotenv.config({ path: '../.env' }); 

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Main Link Verification Route
app.post('/api/connections/test/jira', async (req, res) => {
    const { url, email, token } = req.body;
    
    if (!url || !email || !token) {
        return res.status(400).json({ detail: "Missing connection parameters" });
    }
    
    const baseUrl = url.replace(/\/$/, "");
    const testUrl = `${baseUrl}/rest/api/3/myself`;
    
    try {
        const response = await axios.get(testUrl, {
            auth: { username: email, password: token },
            headers: { 'Accept': 'application/json' },
            timeout: 10000
        });
        
        if (response.status === 200) {
            return res.json({ status: "success", user: response.data.displayName || response.data.name });
        } else {
            return res.status(response.status).json({ detail: response.statusText });
        }
    } catch (error) {
        return res.status(500).json({ detail: error.message });
    }
});

// Fetch Jira Requirements Route
app.post('/api/jira/issues', async (req, res) => {
    const { url, email, token, projectKey, sprintVersion } = req.body;
    
    if (!url || !email || !token || !projectKey) {
        return res.status(400).json({ detail: "Missing connection parameters or project key" });
    }
    
    const baseUrl = url.replace(/\/$/, "");
    const searchUrl = `${baseUrl}/rest/api/3/search/jql`;
    
    // Smart parse the input to handle both full URLs and raw keys
    let extractedKey = projectKey.trim();
    
    try {
        if (extractedKey.startsWith('http')) {
            const urlObj = new URL(extractedKey);
            // Example layout: https://yourdomain.atlassian.net/browse/KAN-4
            if (urlObj.pathname.includes('/browse/')) {
                const parts = urlObj.pathname.split('/');
                extractedKey = parts[parts.length - 1]; // e.g., "KAN-4"
            }
        }
    } catch(e) {
        // Not a valid URL, ignore and use as raw string
    }

    // Construct JQL query dynamically
    let jql = "";
    
    // If the key contains a hyphen, it's typically a specific issue ID (e.g., PROJ-123)
    if (extractedKey.includes('-')) {
        jql = `issueKey = "${extractedKey}"`;
    } else {
        // Otherwise, assume it's a Project Key (e.g., PROJ)
        jql = `project = "${extractedKey}"`;
        // Removed issuetype filter to avoid issues with custom Jira schemes
    }

    if (sprintVersion) {
        jql += ` AND sprint = "${sprintVersion}"`;
    }
    
    // Construct search payload

    try {
        const response = await axios.post(searchUrl, {
            jql: jql,
            maxResults: 50,
            fields: ["summary", "description", "status", "issuetype"]
        }, {
            auth: { username: email, password: token },
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            timeout: 15000
        });
        
        if (response.status === 200) {
            return res.json({ 
                status: "success", 
                count: response.data.total,
                issues: response.data.issues 
            });
        } else {
            return res.status(response.status).json({ detail: response.statusText });
        }
    } catch (error) {
        const errorDetail = error.response?.data?.errorMessages?.[0] || error.message;
        const errObj = {
            message: errorDetail,
            jql: jql,
            data: error.response?.data,
            status: error.response?.status
        };
        fs.writeFileSync('jira-error.log', JSON.stringify(errObj, null, 2));
        console.error("Jira Request JQL:", jql);
        return res.status(500).json({ 
            detail: errorDetail 
        });
    }
});

// Generate Test Plan Route
app.post('/api/generate/testplan', async (req, res) => {
    const { issues, context, llmSettings } = req.body;
    
    if (!issues || !llmSettings || !llmSettings.provider) {
        return res.status(400).json({ detail: "Missing issues or LLM configuration" });
    }

    const { provider, model, apiKey } = llmSettings;
    
    // Construct the super prompt
    let prompt = `You are an expert QA Engineer and Test Planning Agent. 
Generate a structured, professional Test Plan based on the following Jira requirements.
Include test scenarios, test cases, entry/exit criteria, and any identified risks.\n\n`;

    if (context) {
        prompt += `Additional User Context & Constraints:\n${context}\n\n`;
    }

    prompt += `--- REQUIREMENTS ---\n`;
    issues.forEach(issue => {
        prompt += `\n[${issue.key}] ${issue.fields?.summary || ''}\n`;
        prompt += `Type: ${issue.fields?.issuetype?.name || 'N/A'}\n`;
        if (issue.fields?.description) {
            // Some Jira descriptions are Atlassian Document Format (ADF), simple stringify for now or assume strings
            let desc = typeof issue.fields.description === 'string' ? issue.fields.description : JSON.stringify(issue.fields.description);
            // truncate overly long descriptions
            if (desc.length > 1000) desc = desc.substring(0, 1000) + '...';
            prompt += `Description: ${desc}\n`;
        }
    });
    prompt += `\n--- END REQUIREMENTS ---\n\nPlease return the entire test plan in Markdown format.`;

    try {
        let generatedText = "";

        if (provider === 'ollama') {
            const endpoint = 'http://localhost:11434/api/generate';
            const requestModel = model || 'llama3';
            const resp = await axios.post(endpoint, {
                model: requestModel,
                prompt: prompt,
                stream: false
            });
            generatedText = resp.data.response;

        } else if (provider === 'openai' || provider === 'groq') {
            const isGroq = provider === 'groq';
            const endpoint = isGroq ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
            const requestModel = model || (isGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o');
            
            const resp = await axios.post(endpoint, {
                model: requestModel,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.2
            }, {
                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
            });
            generatedText = resp.data.choices[0].message.content;

        } else if (provider === 'gemini') {
            const requestModel = model || 'gemini-2.5-flash';
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${requestModel}:generateContent?key=${apiKey}`;
            const resp = await axios.post(endpoint, {
                contents: [{ parts: [{ text: prompt }] }]
            });
            generatedText = resp.data.candidates[0].content.parts[0].text;

        } else if (provider === 'claude') {
            const endpoint = 'https://api.anthropic.com/v1/messages';
            const requestModel = model || 'claude-3-5-sonnet-20241022';
            const resp = await axios.post(endpoint, {
                model: requestModel,
                max_tokens: 4000,
                messages: [{ role: "user", content: prompt }]
            }, {
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                }
            });
            generatedText = resp.data.content[0].text;
            
        } else {
            return res.status(400).json({ detail: "Unsupported LLM provider" });
        }

        return res.json({ status: "success", plan: generatedText });

    } catch (error) {
        console.error("LLM Generation Error:", error.response?.data || error.message);
        return res.status(500).json({ 
            detail: error.response?.data?.error?.message || error.message || "Failed to generate test plan"
        });
    }
});

app.listen(port, () => {
    console.log(`🚀 Javascript backend running on http://localhost:${port}`);
    console.log(`Ready for React Web UI incoming traffic.`);
});

module.exports = app;
