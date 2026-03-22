import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

interface GenerateRequest {
    provider: string;
    baseUrl: string;
    apiKey: string;
    model: string;
    prompt: string;
}

const systemPrompt = "You are an expert QA Engineer. Generate comprehensive functional and non-functional test cases based on the provided requirement. You MUST output the test cases strictly as a JSON array of objects. Format: { 'Issue Key': 'TEST-1', 'Summary': '...', 'Description': '...', 'Steps to Reproduce': '...', 'Expected Result': '...', 'Priority': '...' }. Output ONLY the JSON array.";

app.post('/api/generate', async (req: Request, res: Response) => {
    try {
        const { provider, baseUrl, apiKey, model, prompt } = req.body as GenerateRequest;
        if (!prompt || !provider) {
             res.status(400).json({ success: false, error: "Missing prompt or provider" });
             return;
        }

        let responseText = "";
        const fetchOptions: any = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        if (provider === 'OpenAI' || provider === 'Groq' || provider === 'LMStudio') {
            fetchOptions.headers['Authorization'] = "Bearer " + apiKey;
            fetchOptions.body = JSON.stringify({
                model: model || (provider === 'Groq' ? 'llama3-8b-8192' : 'gpt-4o'),
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ]
            });
            const resData = await fetch(baseUrl + "/chat/completions", fetchOptions);
            const data: any = await resData.json();
            if(data.error) throw new Error(data.error.message || "API Error");
            responseText = data.choices[0].message.content;

        } else if (provider === 'Ollama') {
            fetchOptions.body = JSON.stringify({
                model: model || 'llama3',
                system: systemPrompt,
                prompt: prompt,
                stream: false,
                format: 'json'
            });
            const resData = await fetch(baseUrl, fetchOptions);
            const data: any = await resData.json();
            responseText = data.response;

        } else if (provider === 'Claude') {
            fetchOptions.headers['x-api-key'] = apiKey;
            fetchOptions.headers['anthropic-version'] = '2023-06-01';
            fetchOptions.body = JSON.stringify({
                model: model || 'claude-3-5-sonnet-20240620',
                max_tokens: 4000,
                system: systemPrompt,
                messages: [{ role: 'user', content: prompt }]
            });
            const resData = await fetch(baseUrl, fetchOptions);
            const data: any = await resData.json();
            responseText = data.content[0].text;

        } else if (provider === 'Gemini') {
            fetchOptions.body = JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: systemPrompt + "\n\nRequirement: " + prompt }] }]
            });
            const resData = await fetch(baseUrl + "?key=" + apiKey, fetchOptions);
            const data: any = await resData.json();
            responseText = data.candidates[0].content.parts[0].text;
        }

        let testCases = [];
        try {
            // Some models return the JSON as a string inside the response
            let cleanResponse = responseText;
            if (provider === 'Ollama' && typeof responseText === 'string') {
                try {
                    // Try to parse if it's double-encoded
                    const parsed = JSON.parse(responseText);
                    if (Array.isArray(parsed)) {
                        cleanResponse = JSON.stringify(parsed);
                    }
                } catch (e) {}
            }
            const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
            testCases = JSON.parse(jsonMatch ? jsonMatch[0] : cleanResponse);
            // Ensure testCases is an array and items are objects
            if (!Array.isArray(testCases)) {
                testCases = [testCases];
            }
            testCases = testCases.map((t: any, idx: number) => {
                if (typeof t === 'string') {
                    return {
                        "Issue Key": `TEST-${idx + 1}`,
                        "Summary": t,
                        "Description": t,
                        "Steps to Reproduce": "Refer to summary",
                        "Expected Result": "Refer to summary",
                        "Priority": "Medium"
                    };
                }
                return t;
            });
        } catch (e) {
            console.error("Parse Error. Raw response:", responseText);
            throw new Error("Failed to parse AI output.");
        }
        res.json({ success: true, testCases });

    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/test-connection', (req, res) => {
    res.json({ success: true, message: "OK" });
});

app.listen(port, () => {
    console.log("Server running on port " + port);
});
