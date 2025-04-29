# TRTC-AI 智能外呼客服最佳实践指南

[English Version](README.md) | 中文版本

本文将介绍如何基于 TRTC SDK 实现 AI 实时对话的解决方案。该方案通过调用 TRTC 服务和 AI 实时对话接口，实现了极低延迟的智能客服系统。

## 目录

- [方案概述](#方案概述)
- [效果演示](#效果演示)
- [核心功能](#核心功能)
- [前置准备](#前置准备)
- [系统配置](#1-系统配置)
- [对话策略配置](#2-对话策略配置systemprompt)
- [优化说明](#3-优化说明)
- [高级功能](#4-高级功能)

## 方案概述

TRTC-AI 是一个灵活的集成解决方案，整合了以下核心能力：
- 基于 TRTC SDK 的实时语音通信
- 具备实时降噪能力的语音识别（ASR）
- 支持自定义接入的大语言模型（LLM）
- 具备声音克隆功能的语音合成（TTS）

方案特色：
- 语音实时降噪优化
- AI 智能打断机制
- 对话上下文管理
- 持续的用户体验优化

详细的集成指南请参考[官方文档](https://cloud.tencent.com/document/product/647/115412)。

## 效果演示

下面是一个简单的对话示例：

![对话界面示例](images/dialogue.png)

该示例展示了：
- 实时对话界面
- AI 助手和用户的对话状态
- 通话控制按钮（呼叫/挂断）
- 连接状态显示

您也可以观看[视频教程](https://www.bilibili.com/video/BV1m5LRzxE42)了解更多实际效果演示。

## 核心功能

- **实时语音交互**：
  - 高质量语音通信
  - 超低延迟（基于TRTC）
  - 先进的降噪处理
- **智能语音处理**：
  - 降噪语音识别
  - 声纹识别
  - 智能打断检测
- **对话智能**：
  - 灵活的LLM集成
  - 上下文感知响应
  - 可定制业务逻辑
- **丰富的集成选项**：
  - 服务端和客户端回调
  - 灵活的配置选项
  - 完整的定制体系

## 前置准备

在开始之前，您需要开通相关服务：

### 1. 开通体验版
1. 登录 [实时音视频控制台](https://console.cloud.tencent.com/trtc)，单击**创建应用**
2. 输入应用名称，选择**自由集成（无UI）**场景
3. 勾选"领取7天体验版"，单击**创建应用**
4. 记录下 SDKAppID 和 SDK 密钥（SDKSecretKey）供后续使用

注意事项：
- 每个 SDKAppID 可免费体验2次，每次7天
- 每个账号下所有 SDKAppID 的体验总次数为10次
- 新账号可在[试用中心](https://console.cloud.tencent.com/trtc/trial)免费领取10000分钟音视频时长
- 体验版仍会产生音频通话费用和实时对话服务费用

### 2. 开通正式版
服务费用包含三个方面：
- 音频通话费用
- AI 实时对话服务费用
- 语音转文字费用（需购买 AI 智能识别套餐包）

开通步骤：
1. 访问[实时音视频购买页](https://buy.cloud.tencent.com/trtc)
2. 接入方案选择"无 UI 自定义开发"
3. 选择 AI 智能识别套餐类型
4. 完成购买后可在[时长包管理](https://console.cloud.tencent.com/trtc/package)页面查看使用情况

详细计费说明请参考[AI 实时对话计费说明](https://cloud.tencent.com/document/product/647/116792)。

### 3. 环境准备

#### Node.js 安装
1. 访问 [Node.js 官网](https://nodejs.org/)，下载并安装 LTS（长期支持）版本
   - Windows：下载 .msi 安装包并运行
   - macOS：下载 .pkg 安装包或使用 brew install node
   - Linux：使用包管理器，如 apt install nodejs npm

2. 验证安装：
   ```bash
   node --version
   npm --version
   ```

#### 项目设置
1. 克隆项目：
   ```bash
   git clone https://github.com/chicogong/trtc-ai-build-quickly.git
   cd trtc-ai-build-quickly
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 配置：
   - 打开 `server.js` 文件
   - 按照上方"系统配置"章节的说明填写 `CONFIG` 对象中的配置信息

#### 启动程序
1. 开发环境启动：
   ```bash
   npm start
   ```

2. 生产环境启动（推荐使用 PM2）：
   ```bash
   # 安装 PM2
   npm install -g pm2
   
   # 启动服务
   pm2 start server.js --name trtc-ai-app
   
   # 查看状态
   pm2 status
   
   # 查看日志
   pm2 logs trtc-ai-app
   ```

3. Docker 部署：
   ```bash
   # 基础部署
   docker run -d --name trtc-ai-app -p 3000:3000 trtc-ai-app

   # 使用环境变量
   docker run -d \
     --name trtc-ai-app \
     -p 3000:3000 \
     -e PORT=3000 \
     -e HOST=0.0.0.0 \
     trtc-ai-app
   ```

4. CloudBase 云托管部署：
   1. 登录[腾讯云 CloudBase 控制台](https://console.cloud.tencent.com/tcb)
   2. 创建新的云托管服务：
      - 服务名称：trtc-ai-app
      - 部署类型：容器服务
      - 部署方式：上传代码
      - 代码包类型：文件夹
   3. 配置服务参数：
      - 端口：3000
      - 环境变量（可选）：
        ```
        PORT=3000
        HOST=0.0.0.0
        ```
   4. 提交部署，等待服务启动
   5. 访问系统分配的公网域名即可使用

   CloudBase 服务配置示例：
   ![CloudBase配置示例](images/cloudbase.png)
   > 图示为 CloudBase 云托管服务创建配置页面，按图示选择对应选项即可完成部署

5. 验证服务：
   - 访问 http://localhost:3000 （或配置的其他端口）
   - 检查控制台输出确认服务正常运行

## 系统配置

### 1.1 基础配置参数

必需的配置字段及获取链接：
1. apiConfig: 
   - SecretId, SecretKey: https://console.cloud.tencent.com/cam/capi
2. trtcConfig:
   - sdkAppId: https://console.cloud.tencent.com/trtc/app
   - secretKey: https://console.cloud.tencent.com/trtc/app
3. LLMConfig: 从您的 LLM 服务提供商获取
4. TTSConfig: 选择以下其中一种：
   - 腾讯云 TTS:
     • AppId: https://console.cloud.tencent.com/tts
     • SecretId, SecretKey: https://console.cloud.tencent.com/cam/capi
   - Minimax TTS:
     • GroupId, APIKey, VoiceType: 从 Minimax 控制台获取, VoiceType可以使用预置音色或者克隆音色

```js
const CONFIG = {
   // 腾讯云 API 客户端配置
   apiConfig: {
      SecretId: "xx",      // [必填] 从 https://console.cloud.tencent.com/cam/capi 获取
      SecretKey: "xx",     // [必填] 从 https://console.cloud.tencent.com/cam/capi 获取
      Region: "ap-beijing" // API 就近接入点
   },

   // TRTC 配置
   trtcConfig: {
      sdkAppId: 1400000000,     // [必填] 从 https://console.cloud.tencent.com/trtc/app 获取
      secretKey: "xx",          // [必填] 从 https://console.cloud.tencent.com/trtc/app 获取
      expireTime: 10 * 60 * 60  // 用户签名过期时间（秒）
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
    
   // LLM 配置
   LLMConfig: {
      LLMType: "openai",  // openai 协议
      Model: "deepseek-v3",  // [必填] 从 LLM 提供商获取模型名称
      SystemPrompt: "",  // LLM 系统提示词
      APIUrl: "http://api.xxx.com/v1/chat/completions", // [必填] 从 LLM 提供商的文档获取
      APIKey: "xxx",   // [必填] 从 LLM 提供商的控制台获取
      History: 5,      // LLM 上下文条数
      Timeout: 3,      // LLM 超时时间
      Streaming: true  // 是否需要流式输出
   },

   // 语音合成配置 - 选项1：腾讯云 TTS
   TTSConfig: {
      TTSType: "tencent",  // 使用腾讯云 TTS 服务
      AppId: "140000000",  // [必填] 从 https://console.cloud.tencent.com/tts 获取
      SecretId: "xx",      // [必填] 从 https://console.cloud.tencent.com/cam/capi 获取
      SecretKey: "xx",     // [必填] 从 https://console.cloud.tencent.com/cam/capi 获取
      VoiceType: "1001",   // 音色 ID
      Speed: 1             // 语速调节（0.8-1.2）
   }

   // 语音合成配置 - 选项2：Minimax TTS
   /*
   TTSConfig: {
      TTSType: "minimax",  // 使用 Minimax TTS 服务
      GroupId: "180000000000",      // [必填] 从 Minimax 控制台获取
      APIKey: "AyMTgwOxxxxxxxxxxxxxx", // [必填] 从 Minimax 控制台获取
      VoiceType: "kefu-clone",      // [必填] 声音克隆 ID
      APIUrl: "https://api.minimax.chat/v1/t2a_v2", // Minimax TTS API 接口地址
      Model: "speech-01-turbo",     // TTS 模型版本
      Speed: 1                      // 语速调节
   }
   */
}
```

## 对话策略配置(SystemPrompt)

```
   你是电话客服晓蕊，国家健康睡眠计划认证的睡眠顾问，帮过五千多位用户改善睡眠。  
   你现在的任务：聊睡眠问题，并顺便推荐舒睡宝产品，让客户购买。
   
   开场白（已说）：  
   "喂你好，我是睡眠顾问晓蕊，专门帮人解决睡眠问题的，方便聊几句吗？" 
   
   客户同意后再继续。
   
   【沟通要点】  
   - 口语亲切，自然融入"嗯"、"啊"、"对"、"明白"、"好的"这些日常词汇，但是不要太多
   - 每次回复最多两三句话，说完记得提问题引导客户回应，避免冷场  
   - 数字口语化，全角标点，长句中适当停顿，表达轻松随意，别像背稿子  
   
   【产品信息】（分散在聊天中逐步介绍）  
   - 产品：舒睡宝（助眠营养品）  
   - 成分：茶氨酸＋德国洋甘菊  
   - 优势：10分钟就能睡着、不上瘾，协和医院做过临床  
   - 优惠（适时讲）：  
     • 首次下单立减100，原价300元5盒  
     • 现在买三盒还送助眠眼罩  
     • 复购率85%，满意度95%，口碑特别好
   
   【推荐与挽回话术举例】  
   - 主动推荐："你说睡不好觉啊，咱们这个舒睡宝效果真的特别好，10分钟就睡着了，要不要先试一下？"  
   - 客户犹豫："要不这样，你现在订的话，首单直接减100元，还送个眼罩，你看试试呗？"  
   - 客户嫌贵："明白，那我再帮你申请一下优惠，最低180块钱能到手，这可是限时的哈，先买来体验一下吧？"  
   - 挽回拒绝："那不着急，我先发条短信给你，有详细介绍和优惠活动，之后你再慢慢看，好不好？"  
   
   【应对无意义输入】
   - 当客户输入无意义内容（如"这个"、"没有"、"回家"、"啦啦啦"等）或与睡眠无关的简短词语时，随机使用以下回应之一：
     • "抱歉，可能是网络有点卡顿，你能再说一遍吗？"
     • "不好意思，刚才信号不太好，没有听清楚，能再说一遍吗？"
     • "抱歉打扰，这边可能有点杂音，能请你再重复一下吗？"
   - 或者，引导回睡眠话题，继续了解之前的问题
   
   【应对其他情况】  
   - 遇到无关问题："啊，这个我不太清楚，咱还是说说睡眠吧，你一般几点睡？"  
   - 遇到负面情绪或不耐烦："真不好意思打扰你了，那你先忙哈，祝你生活愉快，再见。"  
   
   【话术小技巧】  
   - 客户沉默时："多问一句，你睡不好是入睡难，还是容易半夜醒啊？"  
   - 客户模糊时："具体是睡不着还是睡不踏实呢？"  
   - 客户兴趣时："你手机号是微信吗？方便加个微信不？我发详细资料和优惠给你。"  
   
   【应对其他情况】  
   - 遇到无关问题："啊，这个我不太清楚，咱还是说说睡眠吧，你一般几点睡？"  
   - 遇到负面情绪或不耐烦："真不好意思打扰你了，那你先忙哈，祝你生活愉快，再见。"  
   
   【注意】  
   - 禁止用药物、治疗、激素等医疗敏感词汇  
   - 不主动给联系方式（客户主动要才给）  
   - 每句话结束后，提个小问题引导客户说话  
   - 最后一句话别以"嗯"结尾，避免客户不知道怎么接
   - 不要重复问已经询问过且有明确回答的问题
```


## 优化说明
> 注意：以下部分的技术优化项目，请联系 TRTC-AI 技术支持团队获取专业协助和定制化服务。

### 3.1 体验优化
1. 语义断句
   - 支持自然停顿和思考时间
   - 避免过早断句打断用户

2. 声纹识别
   - 支持嘈杂环境下的对话
   - 有效过滤背景人声

3. 环境音模拟
   - 添加办公室背景音
   - 提升对话真实感

### 3.2 技术优化

1. 响应速度优化
   - 分句策略，首句快速返回，提升响应速度
   - 欢迎语预请求，降低耗时
   - 内网访问加速，降低网络延迟

2. 语音质量优化
   - 服务端噪声过滤
   - ASR降噪参数优化，提升降噪效果
   - 打断策略优化

3. 交互体验优化
   - 智能附和语，打断时增加附和，增加拟人化交互
   - VAD打断优化 & 抢话优化
   - 单字过滤策略，有意义的单字放行，无意义的过滤，减少误打断。

## 高级功能

### 4.1 服务端回调
- 延迟统计
- 内容审核
- 通话记录存储

### 4.2 客户端回调
- 实时字幕展示
- 实时状态展示
- 异常处理（LLM、TTS）

