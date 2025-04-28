/**
 * Agent Card Module
 * Handles displaying the AI agent information as a chat message
 */

/**
 * Fetches the agent card information from the server
 * @returns {Promise<Object>} The agent card information
 */
async function getAgentCardInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/getAgentInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agent info: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting agent info:', error);
    // Fallback to default agent info
    return {
      name: "TRTC Assistant",
      avatar: "assets/avatar.png",
      description: "I'm your AI assistant powered by TRTC technology.",
      capabilities: ["Conversation", "Information"],
      voiceType: "Professional female voice (kefu-herui3)",
      personality: "Helpful and friendly"
    };
  }
}

/**
 * Creates and displays the agent info as a chat message
 * @param {Object} agentInfo - The agent information
 */
function displayAgentCard(agentInfo) {
  const capabilities = agentInfo.capabilities.map(cap => `<div class="capability-item">${cap}</div>`).join('');
  
  const cardContent = 
    '<div class="chat-agent-card">' +
    '<div class="agent-header">' +
    `<img src="${agentInfo.avatar}" alt="AI" class="agent-avatar">` +
    '<div class="agent-info">' +
    `<div class="agent-name">${agentInfo.name}</div>` +
    `<div class="agent-voice">${agentInfo.voiceType}</div>` +
    '</div></div>' +
    `<div class="agent-description">${agentInfo.description}</div>` +
    '<div class="agent-capabilities">' +
    '<div class="capabilities-title">我可以帮你：</div>' +
    `<div class="capabilities-list">${capabilities}</div>` +
    '</div>' +
    '<div class="agent-personality">' +
    '<span class="personality-label">个性：</span>' +
    `<span class="personality-text">${agentInfo.personality}</span>` +
    '</div></div>';
  
  // Add to chat as a system message
  if (typeof addSystemMessage === 'function') {
    addSystemMessage(cardContent, true);
  } else {
    console.error('addSystemMessage function not found');
  }
}

/**
 * Initialize the agent card
 */
async function initializeAgentCard() {
  try {
    const agentInfo = await getAgentCardInfo();
    displayAgentCard(agentInfo);
  } catch (error) {
    console.error('Failed to initialize agent card:', error);
  }
}

// Initialize the agent card when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAgentCard); 