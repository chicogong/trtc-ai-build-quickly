/**
 * Tencent Cloud TRTC-AI API Wrapper
 * Prerequisites: npm i express tencentcloud-sdk-nodejs-trtc tls-sig-api-v2
 * Start server: node server.js
 */
const express = require('express');
const path = require('path');
const tencentcloud = require("tencentcloud-sdk-nodejs-trtc");
const TLSSigAPIv2 = require('tls-sig-api-v2');

/**
 * Required Configuration Fields:
 * 1. apiConfig: SecretId, SecretKey
 * 2. trtcConfig: sdkAppId, secretKey
 * 3. LLMConfig: Model, APIUrl, APIKey
 * 4. TTSConfig: AppId, SecretId, SecretKey
 */
const CONFIG = {
    // Tencent Cloud API client configuration
    apiConfig: {
        SecretId: "xx",      // [Required] Replace with your actual SecretId
        SecretKey: "xx",     // [Required] Replace with your actual SecretKey
        Region: "ap-beijing" // API access to the nearest region
    },

    // TRTC configuration
    trtcConfig: {
        sdkAppId: 1400000000,     // [Required] Replace with your actual SDKAppId
        secretKey: "xx",          // [Required] Replace with your actual SecretKey
        expireTime: 10 * 60 * 60  // User signature 10 hours expiration time (seconds)
    },

    // Agent configuration
    AgentConfig: {
        WelcomeMessage: "How are you",  // First words spoken by the AI as they enter the room
        InterruptMode: 2,  // Auto Interrupt with voiceprint
        TurnDetectionMode: 3,  // Sentence segmentation based on semantics
        InterruptSpeechDuration: 200,  // Sensitivity of interruption
        WelcomeMessagePriority: 1  // Welcome message priority to avoid interruption
    },

    // Speech recognition configuration
    STTConfig: {
        Language: "8k_zh_large",  // 8k ASR model with noise reduction
        VadSilenceTime: 600,  // VAD config for delay and interruption balance
        HotWordList: "aha|6,momo|8"  // The hot words list makes the identification more accurate
    },

    // LLM configuration
    LLMConfig: {
        LLMType: "openai",  // openai protocol
        Model: "deepseek-v3",  // [Required] LLM model Name
        SystemPrompt: "",  // LLM system prompt
        APIUrl: "http://api.xxx.com/v1/chat/completions", // [Required] Your LLM API Url
        APIKey: "xxx",   // [Required] Replace with your actual LLM APIKey
        History: 5,      // Number of LLM context entries
        Timeout: 3,      // LLM timeout time
        Streaming: true  // Need streaming
    },

    // Text-to-speech configuration
    TTSConfig: {
        TTSType: "minimax",  // TTS provider
        GroupId: "180000000000",
        APIKey: "AyMTgwOxxxxxxxxxxxxxx",
        VoiceType: "kefu-herui3",  // Use real customer service voice clone
        APIUrl: "https://api.minimax.chat/v1/t2a_v2",
        Model: "speech-01-turbo",
        Speed: 1  // Speech speed adjustment for different scenarios
    }
};

const TrtcClient = tencentcloud.trtc.v20190722.Client;

const clientConfig = {
    credential: {
        secretId: CONFIG.apiConfig.SecretId,
        secretKey: CONFIG.apiConfig.SecretKey,
    },
    region: CONFIG.apiConfig.Region,
    profile: {
        httpProfile: {
            endpoint: "trtc.tencentcloudapi.com",
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
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'dialogue.html')) });

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

        // Generate a random ID between 100000 and 999999
        const generateRandomId = () => Math.floor(100000 + Math.random() * 900000).toString();

        const randomNum = generateRandomId();
        const userId = `user_${randomNum}`;
        const robotId = `ai_${randomNum}`;
        const roomId = parseInt(randomNum);

        // Generate user signatures
        const api = new TLSSigAPIv2.Api(sdkAppId, secretKey);
        const userSig = api.genSig(userId, expireTime);
        const robotSig = api.genSig(robotId, expireTime);

        console.log('Generated user information:', {
            time: new Date().toLocaleString(),
            roomId: roomId,
            userId: userId,
            robotId: robotId,
            expire: `${Math.floor(expireTime/3600)}h`
        });

        res.json({
            sdkAppId,
            userSig,
            robotSig,
            userId,
            robotId,
            roomId
        });
    } catch (error) {
        console.error('Failed to generate user information:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => { 
    console.log(`Server running at http://${HOST}:${PORT}/`);
});