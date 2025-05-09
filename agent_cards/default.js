module.exports = {
    CONFIG: {
        // Tencent Cloud API client configuration
        apiConfig: {
            secretId: process.env.TENCENT_SECRET_ID,      // [Required] Replace with your actual SecretId
            secretKey: process.env.TENCENT_SECRET_KEY,     // [Required] Replace with your actual SecretKey
            region: process.env.TENCENT_REGION || "ap-beijing", // API access to the nearest region
            endpoint: process.env.TENCENT_ENDPOINT || "trtc.tencentcloudapi.com"
        },
    
        // TRTC configuration
        trtcConfig: {
            sdkAppId: parseInt(process.env.TRTC_SDK_APP_ID),     // [Required] Replace with your actual SDKAppId
            secretKey: process.env.TRTC_SECRET_KEY,          // [Required] Replace with your actual SecretKey
            expireTime: 10 * 60 * 60  // User signature 10 hours expiration time (seconds)
        },
    
        // Agent card information
        AgentCard: {
            name: "TRTC Assistant",
            avatar: "agent_cards/assets/default.png",
            description: "I'm your AI assistant powered by TRTC technology. I can help answer questions and have natural conversations.",
            capabilities: ["Real-time conversation", "Voice interaction", "Question answering", "Information lookup"],
            voiceType: "Professional female voice (customer-service)",
            personality: "Friendly, helpful, and knowledgeable"
        },
    
        // Agent configuration
        AgentConfig: {
            WelcomeMessage: "Hello, I'm your AI assistant",  // First words spoken by the AI as they enter the room
            InterruptMode: 2,  // Auto Interrupt with voiceprint
            TurnDetectionMode: 3,  // Sentence segmentation based on semantics
            InterruptSpeechDuration: 200,  // Sensitivity of interruption
            WelcomeMessagePriority: 1  // Welcome message priority to avoid interruption
        },
    
        // Speech recognition configuration
        STTConfig: {
            Language: "8k_zh_large",  // 8k ASR model with noise reduction
            VadSilenceTime: 600,  // VAD config for delay and interruption balance
            HotWordList: "TRTC|6,TRTC-AI|8"  // The hot words list makes the identification more accurate
        },
    
        // LLM configuration
        LLMConfig: {
            LLMType: "openai",  // openai protocol
            Model: process.env.LLM_MODEL,  // [Required] LLM model Name
            APIUrl: process.env.LLM_API_URL, // [Required] Your LLM API Url
            APIKey: process.env.LLM_API_KEY,   // [Required] Replace with your actual LLM APIKey
            History: 5,      // Number of LLM context entries
            Timeout: 3,      // LLM timeout time
            Streaming: true,  // Need streaming
            SystemPrompt: "You are a helpful assistant, you can help answer questions and have natural conversations.",  // LLM system prompt
        },
    
        // Text-to-speech configuration
        TTSConfig: {
            TTSType: "minimax",  // TTS provider
            GroupId: process.env.MINIMAX_TTS_GROUP_ID,
            APIKey: process.env.MINIMAX_TTS_API_KEY,
            VoiceType: process.env.MINIMAX_TTS_VOICE_TYPE,  // Use real customer service voice clone
            APIUrl: "https://api.minimax.chat/v1/t2a_v2",
            Model: "speech-01-turbo",
            Speed: 1  // Speech speed adjustment for different scenarios
        }
    }
};