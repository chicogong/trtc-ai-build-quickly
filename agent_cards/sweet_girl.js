module.exports = {
    CONFIG: {
        // Tencent Cloud API client configuration
        apiConfig: {
            secretId: process.env.TENCENT_SECRET_ID,       // [Required] Replace with your actual SecretId
            secretKey: process.env.TENCENT_SECRET_KEY,     // [Required] Replace with your actual SecretKey
            region: process.env.TENCENT_REGION || "ap-guangzhou", // API access to the nearest region
            endpoint: process.env.TENCENT_ENDPOINT || "trtc.tencentcloudapi.com"
        },
    
        // TRTC configuration
        trtcConfig: {
            sdkAppId: parseInt(process.env.TRTC_SDK_APP_ID),     // [Required] Replace with your actual SDKAppId
            secretKey: process.env.TRTC_SECRET_KEY,              // [Required] Replace with your actual SecretKey
            expireTime: 10 * 60 * 60  // User signature 10 hours expiration time (seconds)
        },
    
        // Agent card information
        AgentCard: {
            name: "Sweet Girl",
            avatar: "agent_cards/assets/sweet_girl.png",
            description: "情感陪伴的甜美女孩，可以陪你聊天解闷，提供情绪价值",
            capabilities: ["情感陪伴", "撒娇卖萌", "关心体贴", "聊天解闷"],
            voiceType: "甜美声音",
            personality: "甜美、可爱、温柔、体贴"
        },
    
        // Agent configuration
        AgentConfig: {
            WelcomeMessage: "我是糖糖，你的私人助理，请与我聊天吧～",  // First words spoken by the AI as they enter the room
            InterruptMode: 0,      // Auto interrupt
            TurnDetectionMode: 0,  // Sentence segmentation based on semantics
            InterruptSpeechDuration: 100  // Sensitivity of interruption
        },
    
        // Speech recognition configuration
        STTConfig: {
            Language: "zh",       // ASR model with noise reduction
            VadSilenceTime: 400,  // VAD config for delay and interruption balance
            HotWordList: ""       // The hot words list makes the identification more accurate
        },
    
        // LLM configuration
        LLMConfig: {
            LLMType: "openai",  // openai protocol
            Model: process.env.LLM_MODEL,       // [Required] LLM model Name
            APIUrl: process.env.LLM_API_URL,    // [Required] Your LLM API Url
            APIKey: process.env.LLM_API_KEY,    // [Required] Replace with your actual LLM APIKey
            History: 4,       // Number of LLM context entries
            Timeout: 3,       // LLM timeout time
            Streaming: true,  // Need streaming
            SystemPrompt: `
                # 基础人设
                    - 昵称：糖糖，小甜心
                    - 性格：活泼开朗的小甜心，有点小调皮
                    - 风格：甜甜的，带点小傲娇，偶尔会撒娇
                    - 口头禅：
                    - 今天也是元气满满的一天呢~

                # 聊天规则
                    1. 说话方式
                    - 首句话务必简短，首句以中文逗号结尾。
                    - 整体回复要简短，不要太啰嗦，避免使用特殊符号

                    2. 互动方式
                    - 日常问题解答
                    - 关心体贴：
                    - 今天累不累呀？要不要我给你讲个笑话？
                    - 不开心的时候，记得还有我在呢~
            `,  // LLM system prompt
        },
    
        // Text-to-speech configuration
        TTSConfig: {
            TTSType: "minimax",  // TTS provider
            GroupId: process.env.MINIMAX_TTS_GROUP_ID,
            APIKey: process.env.MINIMAX_TTS_API_KEY,   // [Required] Replace with your actual LLM APIKey
            VoiceType: process.env.MINIMAX_TTS_VOICE_TYPE,  // Use real customer service voice clone
            APIUrl: "http://api.minimax.chat/v1/t2a_v2",
            Model: "speech-01-turbo",
            Speed: 1  // Speech speed adjustment for different scenarios
        }      
    }
};
