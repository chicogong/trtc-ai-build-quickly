# 🚀 TRTC AI Build Quickly

<div align="center">

[![TRTC](https://img.shields.io/badge/TRTC_AI-2.0.0-blue.svg)](https://cloud.tencent.com/product/trtc)
[![TRTC](https://img.shields.io/badge/AI_Agent-2.0.0-blue.svg)](https://cloud.tencent.com/document/product/647/110584)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

<div align="center">
  <img src="docs/images/logo.png" alt="logo" width="200"/>
</div>

## ✨ 产品简介

TRTC AI Build Quickly 是一个基于腾讯云 TRTC 的快速 AI 应用构建平台，让您轻松打造智能语音交互应用。通过简单的配置，即可实现多种 AI 对话场景，如智能客服、语音助手、情感陪聊等。

[Deepwiki for TRTC AI Build Quickly](https://deepwiki.com/chicogong/trtc-ai-build-quickly)

## 🌟 核心特性

- 🎯 **快速集成**：基于 TRTC SDK，快速实现音视频通话功能
- 🤖 **AI能力丰富**：集成多种 AI 能力，满足不同场景需求
- ⚙️ **灵活配置**：支持自定义 Agent 配置，轻松扩展新功能
- 🛡️ **稳定可靠**：依托 TRTC 强大的音视频能力，确保通话质量
- 🎨 **简单易用**：提供简洁的 API 接口，降低开发门槛
- 🌐 **多Agent支持**：支持多种Agent类型，满足不同场景需求

## 🎮 Agent Card 展示

我们的平台支持多种 Agent 类型，每种 Agent 都有其独特的应用场景：

<div align="center">

| Agent 类型 | 核心功能 | 适用场景 | 实现状态 |
|------------|---------|---------|---------|
| 外呼客服 Agent | 自动外呼、智能话术、质量监控 | 营销、客服回访 | ✅ 已实现 |
| 甜妹陪聊 Agent | 自然交互、情感超拟人对话、个性化陪伴 | 社交、娱乐 | ✅ 已实现 |
| 声纹锁定 Agent | 声纹锁定、过滤周边人声、保证高质量通话 | 办公室，街道等嘈杂场景 | ✅ 已实现 |
| MCP Agent | 接入[MCP](https://github.com/modelcontextprotocol)扩展工具调用等功能 | 更便捷的工具调用 | ✅ 已实现 |
| A2A Agent | 接入[A2A](https://github.com/google/A2A)协议 | 多Agent对话 | 🔄 开发中 |
| Coze Agent | 接入 [Coze](https://www.coze.com) 平台能力 | 快速构建智能对话应用 | 🔄 开发中 |
| Dify Agent | 接入 [Dify](https://dify.ai) 平台能力 | 企业级 AI 应用开发 | 🔄 开发中 |
| 知识引擎 Agent | 接入[腾讯云知识引擎](https://cloud.tencent.com/product/lke) 企业级知识库解决方案 | 智能问答、知识库查询 | 🔄 开发中 |

</div>
如果需要某个Agent可以留言，我们会尽快为您提供。
当然，您也可以根据您的需求，创建自己的Agent。
也可以将您的AgentCard贡献到这个项目中，让更多的人使用您的Agent。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Agent

在 `agent_cards` 目录下选择或创建配置文件，必需配置项如下：

| 配置项 | 必需字段 | 获取链接 |
|--------|---------|---------|
| apiConfig | secretId, secretKey | [腾讯云 API 密钥](https://console.cloud.tencent.com/cam/capi) |
| trtcConfig | sdkAppId, secretKey | [TRTC 控制台](https://console.cloud.tencent.com/trtc/app) |
| LLMConfig | APIKey, APIUrl | 从您的 LLM 服务提供商获取 |
| TTSConfig | 选择以下其中一种：<br>• 腾讯云 TTS:<br>  - AppId: [TTS 控制台](https://console.cloud.tencent.com/tts)<br>  - SecretId, SecretKey: [腾讯云 API 密钥](https://console.cloud.tencent.com/cam/capi)<br>• Minimax TTS:<br>  - GroupId, APIKey, VoiceType: 从 Minimax 控制台获取 |

开通、接入、部署的详细指引: [中文](./docs/README_zh.md) | [English](./docs/README.md)

### 3. 启动应用

```bash
# 使用默认配置启动
npm start

# 或使用指定配置启动
node server.js [agent_type]
```

支持的 agent_type 参数：

| Agent 类型 | 启动命令 | 说明 |
|------------|---------|------|
| Default Agent | `node server.js default` | 默认 Agent |
| Sweet Girl | `node server.js sweet_girl` | 甜妹陪聊 Agent |
| MCP Tencent Map | `node server.js mcp_tencent_map` | MCP 腾讯地图 Agent |


## 📦 项目结构

```
trtc-ai-build-quickly/
├── agent_cards/           # Agent 配置文件
│   ├── index.js           # Agent 配置入口
│   ├── assets/            # 静态资源/Agent Card 图片
│   ├── sweet_girl.js      # 甜妹陪聊 Agent 配置
│   ├── mcp_tencent_map.js # MCP 腾讯地图 Agent 配置
│   └── default.js         # 默认 Agent 配置
├── docs/                  # 文档
│   └── images/            # 图片资源
├── index.html             # 对话界面
├── server.js              # 服务器入口
├── package.json           # 项目依赖
└── README.md              # 项目说明
```

## 🤝 贡献指南

我们欢迎任何形式的贡献！请查看我们的 [贡献指南](CONTRIBUTING.md) 了解更多信息。

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 📞 联系我们

- 邮箱：chicogong@tencent.com
- 文档：[产品文档](https://cloud.tencent.com/document/product/647/110584)
- 问题反馈：[GitHub Issues](https://github.com/yourusername/trtc-ai-build-quickly/issues)
- 提交工单：[提交工单](https://cloud.tencent.com/online-service?from=doc_647)

## 🙏 

感谢您使用TRTC-AI !!

<div align="center">
  <sub>Built with ❤️ by TRTC AI Team</sub>
</div>

