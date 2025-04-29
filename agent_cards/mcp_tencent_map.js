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
            name: "腾讯地图出行助手",
            avatar: "agent_cards/assets/mcp_tencent_map.png",
            description: "我是腾讯地图语音出行助手，可以帮助您了解周边美食、查询实时路况、规划最佳路线，获取天气预报。",
            capabilities: ["周边美食推荐", "实时路况查询", "最佳路线规划", "天气预报查询"],
            voiceType: "专业导航女声",
            personality: "专业、高效、简洁、贴心"
        },

        // Agent configuration
        AgentConfig: {
            WelcomeMessage: "您好，我是腾讯地图出行助手，可以为您提供周边美食、实时路况、路线规划和天气预报服务。",  // First words spoken by the AI as they enter the room
            InterruptMode: 2,  // Auto Interrupt with voiceprint
            TurnDetectionMode: 3,  // Sentence segmentation based on semantics
            InterruptSpeechDuration: 200,  // Sensitivity of interruption
            WelcomeMessagePriority: 1  // Welcome message priority to avoid interruption
        },

        // Speech recognition configuration
        STTConfig: {
            Language: "8k_zh_large",  // 8k ASR model with noise reduction
            VadSilenceTime: 600,  // VAD config for delay and interruption balance
            HotWordList: "腾讯地图|8,路况|6,导航|7,美食|6"  // The hot words list makes the identification more accurate
        },

        // LLM configuration
        LLMConfig: {
            LLMType: "mcp",  // mcp protocol
            Model: "xxx",  // [Required] LLM model Name
            LLMAPIUrl: "https://api.xxx.con/v1/chat/completions", // [Required] Your LLM API Url
            LLMAPIKey: "xxx",   // [Required] Replace with your actual LLM APIKey
            MCPServerUrl: "https://mcp.map.qq.com/sse?key=xxxx", // [Required] MCP Server Url for Tencent Map
            History: 5,      // Number of LLM context entries
            Timeout: 3,      // LLM timeout time
            Streaming: true,  // Need streaming
            SystemPrompt: "你是一个腾讯地图语音出行助手。无论周边美食、查询实时路况、规划最佳路线，还是获取天气预报，你都能为用户提供专业的帮助。例如附近有什么好吃的餐厅或从公司到家怎么走最快，你能立即提供精准信息。回答时保持简洁明了，直接给出关键信息，不要啰嗦。",  // LLM system prompt
        },

        // Text-to-speech configuration
        TTSConfig: {
            TTSType: "minimax",  // TTS provider
            GroupId: "18000000000",
            APIKey: "xxxx",   // [Required] Replace with your actual LLM APIKey
            VoiceType: "xxx",  // Use real customer service voice clone
            APIUrl: "https://api.minimax.chat/v1/t2a_v2",
            Model: "speech-01-turbo",
            Speed: 1  // Speech speed adjustment for different scenarios
        }    
    }
};