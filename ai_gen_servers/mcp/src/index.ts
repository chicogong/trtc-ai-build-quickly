import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

// Create MCP server instance
const getServer = () => {
  const server = new McpServer({
    name: "MCP Example Server",
    version: "1.0.0"
  });

  // Add example tools
  server.tool(
    "echo",
    { message: z.string() },
    async ({ message }) => ({
      content: [{ type: "text", text: `Echo: ${message}` }]
    })
  );

  server.tool(
    "calculate",
    { 
      operation: z.enum(["add", "subtract", "multiply", "divide"]),
      a: z.number(),
      b: z.number()
    },
    async ({ operation, a, b }) => {
      let result: number;
      switch (operation) {
        case "add": result = a + b; break;
        case "subtract": result = a - b; break;
        case "multiply": result = a * b; break;
        case "divide": 
          if (b === 0) throw new Error("Division by zero");
          result = a / b;
          break;
      }
      return {
        content: [{ type: "text", text: `Result: ${result}` }]
      };
    }
  );

  // Add example resources
  server.resource(
    "greeting",
    "greeting://hello",
    async (uri) => ({
      contents: [{
        uri: uri.href,
        text: "Hello from MCP server!"
      }]
    })
  );

  return server;
};

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Store transports by session ID
const transports: Record<string, SSEServerTransport> = {};

// SSE endpoint for establishing the stream
app.get(['/mcp', '/sse'], async (req, res) => {
  console.log(`Received GET request to ${req.path} (establishing SSE stream)`);

  try {
    // Create a new SSE transport for the client
    const transport = new SSEServerTransport('/messages', res);

    // Store the transport by session ID
    const sessionId = transport.sessionId;
    transports[sessionId] = transport;

    // Set up onclose handler to clean up transport when closed
    transport.onclose = () => {
      console.log(`SSE transport closed for session ${sessionId}`);
      delete transports[sessionId];
    };

    // Connect the transport to the MCP server
    const server = getServer();
    await server.connect(transport);

    console.log(`Established SSE stream with session ID: ${sessionId}`);
  } catch (error) {
    console.error('Error establishing SSE stream:', error);
    if (!res.headersSent) {
      res.status(500).send('Error establishing SSE stream');
    }
  }
});

// Messages endpoint for receiving client messages
app.post('/messages', async (req, res) => {
  console.log('Received POST request to /messages');

  const sessionId = req.query.sessionId as string | undefined;
  if (!sessionId) {
    console.error('No session ID provided in request URL');
    res.status(400).send('Missing sessionId parameter');
    return;
  }

  const transport = transports[sessionId];
  if (!transport) {
    console.error(`No active transport found for session ID: ${sessionId}`);
    res.status(404).send('Session not found');
    return;
  }

  try {
    await transport.handlePostMessage(req, res, req.body);
  } catch (error) {
    console.error('Error handling request:', error);
    if (!res.headersSent) {
      res.status(500).send('Error handling request');
    }
  }
});

// Handle server shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');

  // Close all active transports
  for (const sessionId in transports) {
    try {
      console.log(`Closing transport for session ${sessionId}`);
      await transports[sessionId].close();
      delete transports[sessionId];
    } catch (error) {
      console.error(`Error closing transport for session ${sessionId}:`, error);
    }
  }
  console.log('Server shutdown complete');
  process.exit(0);
});

const port = 3000;
app.listen(port, () => {
  console.log(`MCP SSE Server listening on port ${port}`);
}); 