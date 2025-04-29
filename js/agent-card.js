/**
 * Agent Card Module
 * Handles displaying the AI agent information as a chat message
 */

/**
 * Builds HTML for capabilities list
 * @param {string[]} capabilities - List of agent capabilities
 * @returns {string} HTML string for capabilities
 */
function buildCapabilitiesHTML(capabilities) {
  return capabilities.map(cap => `<div class="capability-item">${cap}</div>`).join('');
}

/**
 * Builds the complete agent card HTML
 * @param {Object} agentInfo - Agent information object
 * @returns {string} Complete card HTML string
 */
function buildCardHTML(agentInfo) {
  return (
    '<div class="chat-agent-card">' +
      '<div class="agent-header">' +
        `<img src="${agentInfo.avatar}" alt="AI" class="agent-avatar">` +
        '<div class="agent-info">' +
          `<div class="agent-name">${agentInfo.name}</div>` +
          `<div class="agent-voice">${agentInfo.voiceType}</div>` +
        '</div>' +
      '</div>' +
      `<div class="agent-description">${agentInfo.description}</div>` +
      '<div class="agent-capabilities">' +
        '<div class="capabilities-title">I can help you:</div>' +
        `<div class="capabilities-list">${buildCapabilitiesHTML(agentInfo.capabilities)}</div>` +
      '</div>' +
      '<div class="agent-personality">' +
        '<span class="personality-label">Personality：</span>' +
        `<span class="personality-text">${agentInfo.personality}</span>` +
      '</div>' +
    '</div>'
  );
}

/**
 * Fetches the agent card information from the server
 * @returns {Promise<Object>} Agent information object
 */
async function getAgentCardInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/getAgentInfo`);
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
      capabilities: ["Real-time conversation", "Voice interaction", "Question answering", "Information lookup"],
      voiceType: "Professional female voice (custom-service)",
      personality: "Helpful and friendly"
    };
  }
}

/**
 * Displays the agent card in the chat
 * @param {Object} agentInfo - Agent information object
 */
function displayAgentCard(agentInfo) {
  if (!agentInfo || typeof agentInfo !== 'object') {
    console.error('Invalid agent info');
    return;
  }

  const cardContent = buildCardHTML(agentInfo);
  
  if (typeof addSystemMessage === 'function') {
    addSystemMessage(cardContent, true);
  } else {
    console.error('System message function not found');
  }
}

/**
 * Initializes the agent card
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