require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1" 
});

// Example function definitions
const functions = [
  {
    name: "get_weather",
    description: "Get the current weather in a given location",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA"
        }
      },
      required: ["location"]
    }
  }
];

// Function implementations
const functionImplementations = {
  get_weather: async (args) => {
    // Mock implementation
    return {
      temperature: 72,
      unit: "fahrenheit",
      forecast: ["sunny", "windy"]
    };
  }
};

app.post('/chat', async (req, res) => {
  const { messages } = req.body;
  
  // Log request
  logger.info('Received request', { messages });

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await openai.chat.completions.create({
      model: process.env.LLM_MODEL,
      messages,
      functions,
      stream: true,
    });

    let functionCall = null;

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      const functionCallChunk = chunk.choices[0]?.delta?.function_call;

      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }

      if (functionCallChunk) {
        if (!functionCall) {
          functionCall = { name: '', arguments: '' };
        }
        if (functionCallChunk.name) {
          functionCall.name += functionCallChunk.name;
        }
        if (functionCallChunk.arguments) {
          functionCall.arguments += functionCallChunk.arguments;
        }
      }
    }

    // Handle function call if present
    if (functionCall) {
      const functionName = functionCall.name;
      const functionArgs = JSON.parse(functionCall.arguments);
      
      logger.info('Function call detected', { functionName, functionArgs });

      const result = await functionImplementations[functionName](functionArgs);
      
      // Send function result back to the model
      const response = await openai.chat.completions.create({
        model: process.env.LLM_MODEL,
        messages: [
          ...messages,
          {
            role: "assistant",
            content: null,
            function_call: functionCall
          },
          {
            role: "function",
            name: functionName,
            content: JSON.stringify(result)
          }
        ],
        stream: true
      });

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
    }

    res.write('data: [DONE]\n\n');
  } catch (error) {
    logger.error('Error in chat endpoint', { error: error.message });
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
  } finally {
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
