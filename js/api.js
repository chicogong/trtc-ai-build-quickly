/**
 * API services for TRTC AI conversation
 */

/**
 * Fetches user information from the server
 * @returns {Promise<Object>} The user info object
 */
async function getUserInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/getInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({})
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
 * @returns {Promise<Object>} Object containing user info
 */
async function initChatConfig() {
  try {
    const userInfo = await getUserInfo();
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
    const response = await fetch(`${API_BASE_URL}/startConversation`, {
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