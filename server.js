/**
 * Tencent Cloud TRTC-AI API Wrapper
 * Prerequisites: npm i express tencentcloud-sdk-nodejs-trtc tls-sig-api-v2
 * Start server: node server.js
 */
const express = require('express');
const path = require('path');
const tencentcloud = require("tencentcloud-sdk-nodejs-trtc");
const TLSSigAPIv2 = require('tls-sig-api-v2');
const agentConfig = require('./agent_cards');

// Get agent card file from command line argument or use default
const agentCardFile = process.argv[2] || process.env.AgentCard || 'default';
const CONFIG = agentConfig[agentCardFile].CONFIG;

const TrtcClient = tencentcloud.trtc.v20190722.Client;

const clientConfig = {
    credential: {
        secretId: CONFIG.apiConfig.secretId,
        secretKey: CONFIG.apiConfig.secretKey,
    },
    region: CONFIG.apiConfig.region,
    profile: {
        httpProfile: {
            endpoint: CONFIG.apiConfig.endpoint,
        },
    },
};

const client = new TrtcClient(clientConfig);
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(express.static(__dirname));
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')) });

app.post('/startConversation', (req, res) => {
    const { userInfo } = req.body;
    const { sdkAppId, roomId, robotId, robotSig, userId } = userInfo;

    const params = {
        "SdkAppId": sdkAppId,
        "RoomId": roomId.toString(),
        "AgentConfig": {
            "UserId": robotId,
            "UserSig": robotSig,
            "TargetUserId": userId,
            ...CONFIG.AgentConfig
        },
        "STTConfig": CONFIG.STTConfig,
        "LLMConfig": JSON.stringify(CONFIG.LLMConfig),
        "TTSConfig": JSON.stringify(CONFIG.TTSConfig)
    };

    client.StartAIConversation(params).then(
        (data) => res.json(data),
        (err) => res.status(500).json({ error: err.message })
    );
});

app.post('/stopConversation', (req, res) => {
    const params = req.body;
    client.StopAIConversation(params).then(
        (data) => res.json(data),
        (err) => res.status(500).json({ error: err.message })
    );
});

/**
 * Generate and return user credentials
 * POST /getInfo
 */
app.post('/getInfo', (req, res) => {
    try {
        const { sdkAppId, secretKey, expireTime } = CONFIG.trtcConfig;
        const randomNum = Math.floor(100000 + Math.random() * 900000).toString();
        const userId = `user_${randomNum}`;
        const robotId = `ai_${randomNum}`;
        const roomId = parseInt(randomNum);
        // Generate user signatures
        const api = new TLSSigAPIv2.Api(sdkAppId, secretKey);
        const userSig = api.genSig(userId, expireTime);
        const robotSig = api.genSig(robotId, expireTime);
        
        console.log('Generated user information:', {
            time: new Date().toLocaleString(), roomId, userId, robotId,
            expire: `${Math.floor(expireTime/3600)}h`
        });
        
        res.json({ sdkAppId, userSig, robotSig, userId, robotId, roomId });
    } catch (error) {
        console.error('Failed to generate user information:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get agent card information
 * GET /getAgentInfo
 */
app.get('/getAgentInfo', (req, res) => {
    try {
        res.json(CONFIG.AgentCard);
        console.log("get agent card info: ", CONFIG.AgentCard);
    } catch (error) {
        console.error('Failed to get agent information:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => { 
    console.log(`App running at http://${HOST}:${PORT}/`);
});