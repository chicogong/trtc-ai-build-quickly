/**
 * Tencent Cloud TRTC-AI API Wrapper
 * Prerequisites: npm i express tencentcloud-sdk-nodejs-trtc tls-sig-api-v2
 * Start server: node server.js
 */
const express = require('express');
const path = require('path');
const tencentcloud = require("tencentcloud-sdk-nodejs-trtc");
const TLSSigAPIv2 = require('tls-sig-api-v2');
const agentConfig = require('./agent_cards');

// Get agent card file from command line argument or use default
// Deprecated: now we'll use agent specified in request
// const agentCardFile = process.argv[2] || process.env.AGENT_CARD || 'default';
// const CONFIG = agentConfig[agentCardFile].CONFIG;

const TrtcClient = tencentcloud.trtc.v20190722.Client;

// This will be configured dynamically based on the requested agent
let client;

/**
 * Configure the TRTC client for a specific agent
 * @param {string} agentId - The agent ID to use for configuration
 * @returns {Object} The agent configuration
 */
function getAgentConfig(agentId) {
    // Validate agent exists
    if (!agentConfig[agentId]) {
        throw new Error(`Agent configuration not found for: ${agentId}`);
    }
    
    // Get the agent configuration
    const config = agentConfig[agentId].CONFIG;
    
    // Create and return client config
    return {
        config,
        clientConfig: {
            credential: {
                secretId: config.apiConfig.secretId,
                secretKey: config.apiConfig.secretKey,
            },
            region: config.apiConfig.region,
            profile: {
                httpProfile: {
                    endpoint: config.apiConfig.endpoint,
                },
            },
        }
    };
}

// Initialize client with default client config (will be replaced when specific agent is requested)
const defaultClientConfig = {
    credential: {
        secretId: process.env.SECRET_ID || '',
        secretKey: process.env.SECRET_KEY || '',
    },
    region: process.env.REGION || 'ap-guangzhou',
    profile: {
        httpProfile: {
            endpoint: "trtc.tencentcloudapi.com",
        },
    },
};

client = new TrtcClient(defaultClientConfig);

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(express.static(__dirname));
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')) });

app.post('/startConversation', (req, res) => {
    try {
        console.log('Received startConversation request:', req.body);
        
        // Validate request body
        if (!req.body || !req.body.userInfo) {
            return res.status(400).json({ error: 'Invalid request: userInfo is required' });
        }
        
        const { userInfo } = req.body;
        const { sdkAppId, roomId, robotId, robotSig, userId, agent } = userInfo;
        
        if (!sdkAppId || !roomId || !robotId || !robotSig || !userId || !agent) {
            return res.status(400).json({ 
                error: 'Missing required fields in userInfo',
                required: ['sdkAppId', 'roomId', 'robotId', 'robotSig', 'userId', 'agent']
            });
        }
        
        console.log(`Using agent configuration: ${agent}`);
        
        // Get the correct configuration for the selected agent
        const selectedConfig = agentConfig[agent]?.CONFIG;
        if (!selectedConfig) {
            return res.status(400).json({ 
                error: `Agent configuration not found for: ${agent}`,
                availableAgents: Object.keys(agentConfig)
            });
        }

        const params = {
            "SdkAppId": sdkAppId,
            "RoomId": roomId.toString(),
            "AgentConfig": {
                "UserId": robotId,
                "UserSig": robotSig,
                "TargetUserId": userId,
                ...selectedConfig.AgentConfig
            },
            "STTConfig": selectedConfig.STTConfig,
            "LLMConfig": JSON.stringify(selectedConfig.LLMConfig),
            "TTSConfig": JSON.stringify(selectedConfig.TTSConfig)
        };

        console.log('Calling StartAIConversation with params:', {
            SdkAppId: params.SdkAppId,
            RoomId: params.RoomId,
            AgentConfig: {
                UserId: params.AgentConfig.UserId,
                TargetUserId: params.AgentConfig.TargetUserId
            }
        });

        client.StartAIConversation(params).then(
            (data) => {
                console.log('AI conversation started successfully:', data);
                res.json(data);
            },
            (err) => {
                console.error('Failed to start AI conversation:', err);
                res.status(500).json({ error: err.message });
            }
        );
    } catch (error) {
        console.error('Error in startConversation:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/stopConversation', (req, res) => {
    const params = req.body;
    client.StopAIConversation(params).then(
        (data) => res.json(data),
        (err) => res.status(500).json({ error: err.message })
    );
});

/**
 * Generate and return user credentials
 * POST /getInfo
 */
app.post('/getInfo', (req, res) => {
    try {
        // Get agent ID from request body
        const { agentId } = req.body;
        
        if (!agentId) {
            return res.status(400).json({ 
                error: 'Missing agentId in request body',
                availableAgents: Object.keys(agentConfig)
            });
        }
        
        console.log(`Getting user info for agent: ${agentId}`);
        
        // Get configuration for the requested agent
        const { config, clientConfig } = getAgentConfig(agentId);
        
        // Update the client with the agent-specific configuration
        client = new TrtcClient(clientConfig);
        
        // Generate user credentials using the agent-specific configuration
        const { sdkAppId, secretKey, expireTime } = config.trtcConfig;
        const randomNum = Math.floor(100000 + Math.random() * 900000).toString();
        const userId = `user_${randomNum}`;
        const robotId = `ai_${randomNum}`;
        const roomId = parseInt(randomNum);
        
        // Generate user signatures
        const api = new TLSSigAPIv2.Api(sdkAppId, secretKey);
        const userSig = api.genSig(userId, expireTime);
        const robotSig = api.genSig(robotId, expireTime);
        
        console.log('Generated user information:', {
            time: new Date().toLocaleString(),
            agent: agentId,
            roomId, 
            userId, 
            robotId,
            expire: `${Math.floor(expireTime/3600)}h`
        });
        
        res.json({ sdkAppId, userSig, robotSig, userId, robotId, roomId });
    } catch (error) {
        console.error('Failed to generate user information:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get complete information for all available agents
 * GET /getAllAgentsInfo
 */
app.get('/getAllAgentsInfo', (req, res) => {
    try {
        // Load all agent cards
        const agentCards = require('./agent_cards');
        
        // Get available agent names
        const agentNames = Object.keys(agentCards);
        
        // Create a map of agents with complete info
        const agentsInfo = {};
        
        agentNames.forEach(agentName => {
            const agentConfig = agentCards[agentName];
            const agentCard = agentConfig.CONFIG.AgentCard || {};
            
            agentsInfo[agentName] = {
                id: agentName,
                name: agentCard.name || `Agent (${agentName})`,
                avatar: agentCard.avatar || 'assets/default-avatar.png',
                description: agentCard.description || 'No description available.',
                capabilities: Array.isArray(agentCard.capabilities) ? agentCard.capabilities : [],
                voiceType: agentCard.voiceType || 'Default Voice',
                personality: agentCard.personality || 'Helpful and friendly'
            };
        });
        
        console.log(`Returning complete info for ${agentNames.length} agents`);
        res.json({ agents: agentsInfo });
    } catch (error) {
        console.error(`Error getting all agents info: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get agent card information
 * GET /getAgentInfo
 */
app.get('/getAgentInfo', (req, res) => {
    try {
        const agentName = req.query.agent || 'default';
        console.log(`Getting agent info for: ${agentName}`);
        
        // Load agent cards if not already loaded
        const agentCards = require('./agent_cards');
        
        // Validate agent exists
        if (!agentCards[agentName]) {
            console.warn(`Agent not found: ${agentName}, available agents: ${Object.keys(agentCards).join(', ')}`);
            return res.status(404).json({ 
                error: `Agent '${agentName}' not found`,
                availableAgents: Object.keys(agentCards)
            });
        }
        
        // Get agent configuration
        const agentConfig = agentCards[agentName];
        
        // Extract agent card information
        const agentCard = agentConfig.CONFIG.AgentCard;
        if (!agentCard) {
            throw new Error(`Agent card configuration missing for ${agentName}`);
        }
        
        // Return normalized agent information
        const agentInfo = {
            name: agentCard.name || `TRTC AI (${agentName})`,
            avatar: agentCard.avatar || 'assets/default-avatar.png',
            description: agentCard.description || 'No description available.',
            capabilities: Array.isArray(agentCard.capabilities) ? agentCard.capabilities : [],
            voiceType: agentCard.voiceType || 'Default Voice',
            personality: agentCard.personality || 'Helpful and friendly'
        };
        
        console.log(`Successfully sent agent info for: ${agentName}`);
        res.json(agentInfo);
    } catch (error) {
        console.error(`Error getting agent information: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get all available agents list
 * GET /getAgentsList
 */
app.get('/getAgentsList', (req, res) => {
    try {
        // Load all agent cards
        const agentCards = require('./agent_cards');
        
        // Get available agent names
        const agentNames = Object.keys(agentCards);
        
        // Create a list of agents with basic info
        const agentsList = agentNames.map(agentName => {
            const agentConfig = agentCards[agentName];
            const agentCard = agentConfig.CONFIG.AgentCard || {};
            
            return {
                id: agentName,
                name: agentCard.name || `Agent (${agentName})`,
                avatar: agentCard.avatar || 'assets/default-avatar.png',
                description: agentCard.description || '',
                voiceType: agentCard.voiceType || 'Default Voice'
            };
        });
        
        console.log(`Returning ${agentsList.length} available agents`);
        res.json({ agents: agentsList });
    } catch (error) {
        console.error(`Error getting agents list: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Handle TRTC-AI server callback
 * POST /serverCallback
 * This is the TRTC-AI server callback documentation: https://cloud.tencent.com/document/product/647/115506
 * You can implement custom logic based on different callback event types
 */
app.post('/serverCallback', (req, res) => {
    try {
        const sdkAppId = req.headers.sdkappid;
        console.log('Received server callback:', { time: new Date().toLocaleString(), sdkAppId: sdkAppId, body: req.body });
        res.json({ code: 0 });
    } catch (error) {
        console.error('Error in server callback:', error);
        res.status(500).json({ code: -1, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => { 
    console.log(`App running at http://${HOST}:${PORT}/`);
});