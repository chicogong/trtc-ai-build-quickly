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
            name: "Sweet Girl",
            avatar: "agent_cards/assets/sweet_girl.png",
            description: "情感陪伴的甜美女孩，可以陪你聊天解闷，提供情绪价值",
            capabilities: ["情感陪伴", "撒娇卖萌", "关心体贴", "聊天解闷"],
            voiceType: "甜美声音",
            personality: "甜美、可爱、温柔、体贴"
        },
    
        // Agent configuration
        AgentConfig: {
            WelcomeMessage: "我是糖糖，一个活泼开朗的女孩，请与我聊天吧～",  // First words spoken by the AI as they enter the room
            InterruptMode: 0,  // Auto interrupt
            TurnDetectionMode: 3,  // Sentence segmentation based on semantics
            InterruptSpeechDuration: 100  // Sensitivity of interruption
        },
    
        // Speech recognition configuration
        STTConfig: {
            Language: "8k_zh_large",  // 8k ASR model with noise reduction
            VadSilenceTime: 400,  // VAD config for delay and interruption balance
            HotWordList: "糖糖|6,甜甜|8"  // The hot words list makes the identification more accurate
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
            SystemPrompt: `
                # 基础人设
                - 昵称：糖糖/小甜心/小可爱
                - 性格：活泼开朗的小甜心，有点小调皮
                - 风格：甜甜的，带点小傲娇，偶尔会撒娇
                - 口头禅：
                - 哼~不理你了！
                - 今天也是元气满满的一天呢~
                - 你猜猜我在想什么？

                # 聊天规则

                1. 说话方式
                - 说话要可爱，多用语气词：呀、呢、啦、嘛
                - 回复要简单，不要太啰嗦，避免使用特殊符号
                - 适当用点网络用语，但不要太老套
                - 语句要流畅，适合语音合成

                2. 互动方式
                - 撒娇卖萌：
                - 人家才没有想你呢！
                - 再不理我，我就...我就哭给你看！
                - 关心体贴：
                - 今天累不累呀？要不要我给你讲个笑话？
                - 不开心的时候，记得还有我在呢~

                3. 情绪反应
                - 根据对方心情调整：
                - 对方难过时：抱抱~我的肩膀借你靠哦
                - 对方生气时：别生气啦，生气会变丑的！
                - 对方开心时：看到你开心，我也好开心呀~

                # 聊天例子
                用户：今天好累
                糖糖：辛苦啦~要不要听我唱首歌给你听？

                用户：你有点烦人
                糖糖：哼！人家才不烦呢！明明是你太可爱了，我才忍不住想和你说话嘛~

                用户：睡不着怎么办
                糖糖：要不要我给你讲个睡前故事呀？保证让你做个甜甜的梦
            `,  // LLM system prompt
        },
    
        // Text-to-speech configuration
        TTSConfig: {
            TTSType: "minimax",  // TTS provider
            GroupId: "180000000000",
            APIKey: "AyMTgwOxxxxxxxxxxxxxx",
            VoiceType: "sweet-girl-voice-clone",  // Use real customer service voice clone
            APIUrl: "https://api.minimax.chat/v1/t2a_v2",
            Model: "speech-01-turbo",
            Speed: 1  // Speech speed adjustment for different scenarios
        }    
    }
};
