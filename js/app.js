/**
 * Main application file for TRTC-AI Conversation
 */

// Application state
let taskId = null;
let muteState = false;

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
    // Disable start button while connecting
    startButton.disabled = true;
    updateStatus('room', "Connecting...");

    const { userInfo } = await initChatConfig();
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

    // Start AI conversation
    const response = await startAIConversation(JSON.stringify({ userInfo }));
    taskId = response.TaskId;
    console.log('AI conversation started with task ID:', taskId);

    // Enable control buttons
    endButton.disabled = false;
    sendButton.disabled = false;
    interruptButton.disabled = false;
    muteButton.disabled = false;
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
}

/**
 * ===========================================
 * UI INTERACTION FUNCTIONS
 * ===========================================
 */

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
 * Initialize the application
 */
function initializeApp() {
  // Set up event listeners
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