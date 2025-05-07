# MCP Streamable HTTP Server

这是一个基于 Model Context Protocol (MCP) 的 Streamable HTTP 服务器实现，支持 SSE（Server-Sent Events）传输。

## 功能特性

- 支持 SSE 传输协议
- 提供会话管理和自动清理
- 内置示例工具（echo 和计算器）
- 提供示例资源访问
- 支持 CORS 跨域请求
- 优雅的服务器关闭处理

## 安装

```bash
# 安装依赖
npm install
```

## 开发

```bash
# 启动开发服务器
npm run dev
```

## 构建

```bash
# 构建生产版本
npm run build
```

## 运行

```bash
# 运行生产版本
npm start
```

## API 端点

服务器提供以下端点：

- `GET /mcp` 或 `GET /sse` - 建立 SSE 连接
- `POST /messages` - 处理客户端消息
  - 查询参数: `sessionId` - 会话标识符

## 示例工具

### 1. Echo 工具
```json
{
  "jsonrpc": "2.0",
  "method": "callTool",
  "params": {
    "name": "echo",
    "arguments": {
      "message": "Hello, World!"
    }
  },
  "id": 1
}
```

### 2. 计算器工具
支持的操作：add, subtract, multiply, divide
```json
{
  "jsonrpc": "2.0",
  "method": "callTool",
  "params": {
    "name": "calculate",
    "arguments": {
      "operation": "add",
      "a": 5,
      "b": 3
    }
  },
  "id": 1
}
```

## 示例资源

### 访问 greeting 资源
```json
{
  "jsonrpc": "2.0",
  "method": "readResource",
  "params": {
    "uri": "greeting://hello"
  },
  "id": 1
}
```

## 环境变量

- `PORT` - 服务器端口号（默认：3000）

## 调试工具

可以使用 MCP Inspector 进行服务器调试：

```bash
# 安装 Inspector
npm install -g @modelcontextprotocol/inspector

# 启动 Inspector
npx @modelcontextprotocol/inspector http http://localhost:3000
```

## 技术栈

- TypeScript
- Express.js
- Model Context Protocol SDK
- SSE (Server-Sent Events)
- CORS 