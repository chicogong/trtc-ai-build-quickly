/**
 * Agent Card Module
 * Handles displaying the AI agent information as a chat message
 */

/**
 * ===========================================
 * AGENT CARD HTML BUILDING
 * ===========================================
 */

/**
 * Creates HTML for a capability item
 * @param {string} capability - The capability text
 * @returns {string} HTML string for the capability
 */
function createCapabilityItem(capability) {
  return `<span class="capability-item">${capability}</span>`;
}

/**
 * Builds HTML for capabilities list
 * @param {string[]} capabilities - List of agent capabilities
 * @returns {string} HTML string for capabilities
 */
function buildCapabilitiesHTML(capabilities) {
  if (!capabilities || !Array.isArray(capabilities) || capabilities.length === 0) {
    return '';
  }
  return capabilities.map(cap => createCapabilityItem(cap)).join('');
}

/**
 * Builds the complete agent card HTML
 * @param {Object} agentInfo - Agent information object
 * @returns {string} Complete card HTML string
 */
function buildCardHTML(agentInfo) {
  if (!agentInfo) return '';
  
  const avatar = agentInfo.avatar || 'assets/default-avatar.png';
  const name = agentInfo.name || 'AI Assistant';
  const voiceType = agentInfo.voiceType || 'Default Voice';
  const description = agentInfo.description || 'No description available.';
  const capabilities = agentInfo.capabilities || [];
  const personality = agentInfo.personality || '';
  
  return `
    <div class="chat-agent-card">
      <div class="agent-header">
        <img src="${avatar}" alt="AI" class="agent-avatar">
        <div class="agent-info">
          <div class="agent-name">${name}</div>
          <div class="agent-voice">${voiceType}</div>
        </div>
      </div>
      <div class="agent-description">${description}</div>
      ${capabilities.length > 0 ? `
        <div class="agent-capabilities">
          <div class="capabilities-title">I can help you:</div>
          <div class="capabilities-list">${buildCapabilitiesHTML(capabilities)}</div>
        </div>
      ` : ''}
      ${personality ? `
        <div class="agent-personality">
          <span class="personality-label">Personality：</span>
          <span class="personality-text">${personality}</span>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * ===========================================
 * AGENT CARD DISPLAY
 * ===========================================
 */

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
 * Update the agent card with new agent information
 * @param {Object} agentInfo - The agent information object
 */
function updateAgentCard(agentInfo) {
  if (!agentInfo) {
    console.error('No agent info provided');
    return;
  }

  // Create agent card HTML
  const cardHTML = buildCardHTML(agentInfo);

  // Add the card to the chat list
  const chatList = document.querySelector('.chat-list');
  if (!chatList) {
    console.error('Chat list element not found');
    return;
  }
  
  const cardElement = document.createElement('div');
  cardElement.className = 'chat-item ai';
  cardElement.innerHTML = cardHTML;
  
  // Remove any existing agent cards
  const existingCards = chatList.querySelectorAll('.chat-agent-card');
  existingCards.forEach(card => card.closest('.chat-item')?.remove());
  
  // Add the new card at the top of the chat list
  chatList.insertBefore(cardElement, chatList.firstChild);
}

// Note: We no longer initialize the agent card automatically on DOM load.
// Agent cards will only be displayed when explicitly selected by the user.
// The initializing code below has been commented out as it used a default agent.

/*
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
*/ 