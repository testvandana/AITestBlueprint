const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

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

app.listen(port, () => {
    console.log(`🚀 Javascript backend running on http://localhost:${port}`);
    console.log(`Ready for React Web UI incoming traffic.`);
});
