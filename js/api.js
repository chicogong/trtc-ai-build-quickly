/**
 * API services for TRTC AI conversation
 */

/**
 * Fetches user information from the server
 * @param {string} agentId - The agent ID to use for the conversation
 * @returns {Promise<Object>} The user info object
 */
async function getUserInfo(agentId) {
  try {
    if (!agentId) {
      throw new Error('Agent ID is required');
    }
    
    const response = await fetch(`${API_BASE_URL}/getInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agentId })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }

    const userInfo = await response.json();
    console.log('User info retrieved successfully');
    return userInfo;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
}

/**
 * Initializes the chat configuration
 * @param {string} [agentId] - Optional agent ID to include in user info
 * @returns {Promise<Object>} Object containing user info
 */
async function initChatConfig(agentId) {
  try {
    if (!agentId) {
      throw new Error('Agent ID is required for chat configuration');
    }
    
    // Get user info from server with the specified agent
    const userInfo = await getUserInfo(agentId);
    
    // Add agent info to ensure it's passed in the conversation request
    userInfo.agent = agentId;
    console.log('Chat config initialized with agent:', agentId);
    
    return { userInfo };
  } catch (error) {
    console.error('Failed to initialize chat config:', error);
    throw error;
  }
}

/**
 * API call to start the AI conversation
 * @param {string} data - The user information for the conversation (stringified JSON)
 * @returns {Promise<Object>} The API response
 */
async function startAIConversation(data) {
  try {
    console.log('Starting AI conversation with data:', data);
    
    const response = await fetch(`${API_BASE_URL}/startConversation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to start AI conversation:", error);
    throw error;
  }
}

/**
 * API call to stop the AI conversation
 * @param {string} data - The task information to stop (stringified JSON)
 * @returns {Promise<Object>} The API response
 */
async function stopAIConversation(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/stopConversation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to stop AI conversation:", error);
    throw error;
  }
} 