/**
 * Main application file for TRTC-AI Conversation
 */

// Application state
let taskId = null;
let muteState = false;
let selectedAgent = null;
let agentsCache = {}; // Cache to store all agent information

/**
 * ===========================================
 * MAIN APPLICATION FUNCTIONS
 * ===========================================
 */

/**
 * Starts the conversation with the AI
 */
async function startConversation() {
  try {
    // Validate agent selection
    if (!selectedAgent) {
      addSystemMessage("Please select an AI assistant first");
      return;
    }
    
    // Disable start button while connecting
    startButton.disabled = true;
    updateStatus('room', "Connecting...");

    // Get user info from API module with selected agent
    const { userInfo } = await initChatConfig(selectedAgent);
    
    const { sdkAppId, userSig, userId, roomId, robotId } = userInfo;

    // Save user information
    setUserIds(userId, robotId);

    // Enter the TRTC room
    await enterTRTCRoom({
      roomId,
      sdkAppId,
      userId,
      userSig
    });

    updateStatus('room', "✅ Connected");

    // Start AI conversation - Fix: Pass userInfo directly without extra nesting
    const response = await startAIConversation(JSON.stringify({ userInfo }));
    taskId = response.TaskId;
    console.log('AI conversation started with task ID:', taskId);

    // Enable control buttons
    endButton.disabled = false;
    sendButton.disabled = false;
    interruptButton.disabled = false;
    muteButton.disabled = false;

    // Add call-active class to hide agent selection
    document.getElementById('app').classList.add('call-active');
  } catch (error) {
    console.error("Failed to start conversation:", error);
    updateStatus('room', "Connection Failed");
    startButton.disabled = false;

    // Display error in chat
    addSystemMessage(`Failed to start conversation: ${error.message}`);
  }
}

/**
 * Stops the conversation with the AI
 */
async function stopConversation() {
  // Disable buttons while disconnecting
  endButton.disabled = true;
  sendButton.disabled = true;
  interruptButton.disabled = true;
  muteButton.disabled = true;
  muteButton.textContent = 'Mute';
  muteButton.classList.remove('muted');
  muteState = false;
  updateStatus('room', "Disconnecting...");

  try {
    // Stop the AI conversation task
    if (taskId) {
      await stopAIConversation(JSON.stringify({
        TaskId: taskId,
      }));
      console.log('AI conversation stopped successfully');
    }
  } catch (error) {
    console.error('Error stopping AI conversation:', error);
  }

  try {
    // Exit the TRTC room
    await exitTRTCRoom();
  } catch (error) {
    console.error('Error exiting TRTC room:', error);
  }

  // Display metrics statistics
  displayLatencyStatistics();
  
  // Clean up resources
  destroyTRTCClient();

  // Reset UI state and metrics data
  taskId = null;
  resetMetrics();
  resetUI();

  // Remove call-active class to show agent selection
  document.getElementById('app').classList.remove('call-active');
}

/**
 * ===========================================
 * UI INTERACTION FUNCTIONS
 * ===========================================
 */

/**
 * Loads and displays information about the selected agent from cache
 * @param {string} agentId - The ID of the selected agent
 */
function showAgentInfo(agentId) {
  try {
    // Don't load agent info if no agent is selected
    if (!agentId) {
      console.log('No agent selected, skipping agent info display');
      return;
    }
    
    // Check if we have agent info in cache
    if (!agentsCache[agentId]) {
      console.error(`Agent info not found in cache for: ${agentId}`);
      addSystemMessage(`Could not display agent information for: ${agentId}`);
      return;
    }
    
    // Update the agent card with cached info
    updateAgentCard(agentsCache[agentId]);
    console.log(`Displayed agent info for: ${agentId} from cache`);
  } catch (error) {
    console.error('Failed to display agent info:', error);
    addSystemMessage(`Failed to display agent: ${error.message}`);
  }
}

/**
 * Send a text message from the input field
 */
function handleSendMessage() {
  if (sendCustomTextMessage(textInput.value)) {
    textInput.value = ""; // Clear the input field
  }
}

/**
 * Toggle mute state
 */
async function handleToggleMute() {
  muteState = !muteState;
  const success = await toggleMute(muteState);
  if (success) {
    muteButton.textContent = muteState ? 'Unmute' : 'Mute';
    // Update the before content using a CSS class
    if (muteState) {
      muteButton.classList.add('muted');
    } else {
      muteButton.classList.remove('muted');
    }
  }
}

/**
 * ===========================================
 * INITIALIZATION AND EVENT LISTENERS
 * ===========================================
 */

/**
 * Loads all available agents from the server with their complete information
 */
async function loadAllAgentsInfo() {
  try {
    const agentSelect = document.getElementById('agent-select');
    const startButton = document.getElementById('start-button');
    
    if (!agentSelect) return;
    
    // Disable start button until agents are loaded
    if (startButton) {
      startButton.disabled = true;
      startButton.title = "Loading agents...";
    }
    
    // Clear chat list to remove any existing agent cards
    const chatList = document.querySelector('.chat-list');
    if (chatList) {
      chatList.innerHTML = '';
    }
    
    // Set loading state
    agentSelect.setAttribute('data-loading', 'true');
    agentSelect.disabled = true;
    
    // Clear existing options
    agentSelect.innerHTML = '';
    
    // Add loading option
    const loadingOption = document.createElement('option');
    loadingOption.disabled = true;
    loadingOption.selected = true;
    loadingOption.textContent = 'Loading agents...';
    agentSelect.appendChild(loadingOption);
    
    // Fetch all agents info from server
    const response = await fetch(`${API_BASE_URL}/getAllAgentsInfo`);
    if (!response.ok) {
      throw new Error(`Failed to fetch agents info: ${response.status}`);
    }
    
    const data = await response.json();
    const agentsData = data.agents || {};
    const agentIds = Object.keys(agentsData);
    
    // Store all agent info in cache
    agentsCache = agentsData;
    
    // Remove loading state
    agentSelect.removeAttribute('data-loading');
    agentSelect.disabled = false;
    
    // Clear loading option
    agentSelect.innerHTML = '';
    
    if (agentIds.length === 0) {
      const noAgentsOption = document.createElement('option');
      noAgentsOption.disabled = true;
      noAgentsOption.textContent = 'No agents available';
      agentSelect.appendChild(noAgentsOption);
      
      // Keep start button disabled
      if (startButton) {
        startButton.disabled = true;
        startButton.title = "No agents available";
      }
      
      // Show message in chat
      addSystemMessage("No AI assistants available. Please try again later.");
      return;
    }
    
    // Add agents to select dropdown
    agentIds.forEach(agentId => {
      const agent = agentsData[agentId];
      const option = document.createElement('option');
      option.value = agentId;
      option.textContent = agent.name;
      agentSelect.appendChild(option);
    });
    
    // Automatically select the first agent
    if (agentIds.length > 0) {
      selectedAgent = agentIds[0];
      agentSelect.value = selectedAgent;
      
      // Enable start button
      if (startButton) {
        startButton.disabled = false;
        startButton.title = "";
      }
      
      // Display the first agent's information from cache
      showAgentInfo(selectedAgent);
    }
    
    console.log(`Loaded ${agentIds.length} agents, selected: ${selectedAgent}`);
  } catch (error) {
    console.error('Failed to load agents info:', error);
    const agentSelect = document.getElementById('agent-select');
    const startButton = document.getElementById('start-button');
    
    if (agentSelect) {
      // Remove loading state
      agentSelect.removeAttribute('data-loading');
      agentSelect.disabled = false;
      
      agentSelect.innerHTML = '';
      const errorOption = document.createElement('option');
      errorOption.disabled = true;
      errorOption.selected = true;
      errorOption.textContent = 'Error loading agents';
      agentSelect.appendChild(errorOption);
    }
    
    // Keep start button disabled
    if (startButton) {
      startButton.disabled = true;
      startButton.title = "Failed to load agents";
    }
    
    // Add error message to chat
    addSystemMessage(`Failed to load agents: ${error.message}`);
  }
}

/**
 * Initialize the application
 */
function initializeApp() {
  // Get DOM elements
  const agentSelect = document.getElementById('agent-select');
  const startButton = document.getElementById('start-button');
  
  // Set up agent selection handling
  agentSelect.addEventListener('change', (e) => {
    selectedAgent = e.target.value;
    
    // Enable start button once an agent is selected
    if (startButton && selectedAgent) {
      startButton.disabled = false;
      startButton.title = "";
    }
    
    // Display agent info from cache
    showAgentInfo(selectedAgent);
  });
  
  // Load all agents info from server
  loadAllAgentsInfo();
  
  // Set up main button event listeners
  startButton.addEventListener('click', startConversation);
  endButton.addEventListener('click', stopConversation);
  sendButton.addEventListener('click', handleSendMessage);
  interruptButton.addEventListener('click', sendInterruptSignal);
  muteButton.addEventListener('click', handleToggleMute);
  
  // Handle Enter key press in text input
  textInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !sendButton.disabled) {
      handleSendMessage();
    }
  });
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp); 