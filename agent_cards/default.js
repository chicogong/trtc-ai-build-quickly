module.exports = {
    CONFIG: {
        // Tencent Cloud API client configuration
        apiConfig: {
            secretId: "xx",      // [Required] Replace with your actual SecretId
            secretKey: "xx",     // [Required] Replace with your actual SecretKey
            region: "ap-beijing", // API access to the nearest region
            endpoint: "trtc.tencentcloudapi.com"
        },
    
        // TRTC configuration
        trtcConfig: {
            sdkAppId: 1400000000,     // [Required] Replace with your actual SDKAppId
            secretKey: "xx",          // [Required] Replace with your actual SecretKey
            expireTime: 10 * 60 * 60  // User signature 10 hours expiration time (seconds)
        },
    
        // Agent card information
        AgentCard: {
            name: "TRTC Assistant",
            avatar: "assets/avatar.png",
            description: "I'm your AI assistant powered by TRTC technology. I can help answer questions and have natural conversations.",
            capabilities: ["Real-time conversation", "Voice interaction", "Question answering", "Information lookup"],
            voiceType: "Professional female voice (customer-service)",
            personality: "Friendly, helpful, and knowledgeable"
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
            HotWordList: "TRTC|6,TRTC-AI|8"  // The hot words list makes the identification more accurate
        },
    
        // LLM configuration
        LLMConfig: {
            LLMType: "openai",  // openai protocol
            Model: "deepseek-v3",  // [Required] LLM model Name
            APIUrl: "http://api.xxx.com/v1/chat/completions", // [Required] Your LLM API Url
            APIKey: "xxx",   // [Required] Replace with your actual LLM APIKey
            History: 5,      // Number of LLM context entries
            Timeout: 3,      // LLM timeout time
            Streaming: true,  // Need streaming
            SystemPrompt: "You are a helpful assistant, you can help answer questions and have natural conversations.",  // LLM system prompt
        },
    
        // Text-to-speech configuration
        TTSConfig: {
            TTSType: "minimax",  // TTS provider
            GroupId: "180000000000",
            APIKey: "AyMTgwOxxxxxxxxxxxxxx",
            VoiceType: "customer-service-voice-clone",  // Use real customer service voice clone
            APIUrl: "https://api.minimax.chat/v1/t2a_v2",
            Model: "speech-01-turbo",
            Speed: 1  // Speech speed adjustment for different scenarios
        }
    }
};