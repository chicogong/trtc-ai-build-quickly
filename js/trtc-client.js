/**
 * TRTC client module for handling TRTC-specific functionality
 */

// TRTC client instance
let trtcClient = null;
let currentUserId = null;
let botUserId = null;

/**
 * ===========================================
 * TRTC INITIALIZATION AND CORE FUNCTIONALITY
 * ===========================================
 */

/**
 * Initialize TRTC client
 * @returns {Object} The TRTC client instance
 */
function initTRTCClient() {
  if (!trtcClient) {
    trtcClient = TRTC.create();
  }
  return trtcClient;
}

/**
 * Enter TRTC room
 * @param {Object} params - The room parameters
 * @returns {Promise} Promise that resolves when room is entered
 */
async function enterTRTCRoom(params) {
  const client = initTRTCClient();
  await client.enterRoom({
    roomId: parseInt(params.roomId),
    scene: "rtc",
    sdkAppId: params.sdkAppId,
    userId: params.userId,
    userSig: params.userSig,
  });
  
  // Set up message handler
  client.on(TRTC.EVENT.CUSTOM_MESSAGE, handleTRTCMessage);
  
  // Set up audio volume handler
  client.on(TRTC.EVENT.AUDIO_VOLUME, handleAudioVolume);
  
  // Enable audio volume evaluation with higher frequency (50ms) for smoother visualization
  client.enableAudioVolumeEvaluation(50);
  
  // Start audio
  await client.startLocalAudio();
  console.log('Local audio started successfully');
  
  return client;
}

/**
 * Exit TRTC room
 * @returns {Promise} Promise that resolves when room is exited
 */
async function exitTRTCRoom() {
  try {
    if (trtcClient) {
      await trtcClient.exitRoom();
      console.log('Successfully exited TRTC room');
    }
  } catch (error) {
    console.error('Error exiting TRTC room:', error);
    throw error;
  }
}

/**
 * Destroy TRTC client
 */
function destroyTRTCClient() {
  if (trtcClient) {
    trtcClient.destroy();
    trtcClient = null;
  }
}

/**
 * Set user IDs
 * @param {string} userId - The current user ID
 * @param {string} aiUserId - The AI bot user ID
 */
function setUserIds(userId, aiUserId) {
  currentUserId = userId;
  botUserId = aiUserId;
}

/**
 * ===========================================
 * AUDIO CONTROL FUNCTIONS
 * ===========================================
 */

/**
 * Toggle mute status for local audio
 * @param {boolean} mute - Whether to mute (true) or unmute (false)
 * @returns {Promise} Promise that resolves when mute status is updated
 */
async function toggleMute(mute) {
  if (!trtcClient) return false;
  
  try {
    await trtcClient.updateLocalAudio({ mute: mute });
    console.log(`Local audio ${mute ? 'muted' : 'unmuted'} successfully`);
    return true;
  } catch (error) {
    console.error('Error toggling mute status:', error);
    return false;
  }
}

/**
 * ===========================================
 * MESSAGING FUNCTIONS
 * ===========================================
 */

/**
 * Send a custom text message to the AI
 * @param {string} message - The message to send
 */
function sendCustomTextMessage(message) {
  if (!trtcClient || !message.trim()) return;
  
  try {
    const messageText = message.trim();
    const messageId = Date.now().toString(); // Simple unique ID
    
    // Create custom message payload
    const payload = {
      type: MESSAGE_TYPES.CUSTOM_TEXT,
      sender: currentUserId,
      receiver: [botUserId],
      payload: {
        id: messageId,
        message: messageText,
        timestamp: Date.now()
      }
    };
    
    // Send the message through TRTC
    trtcClient.sendCustomMessage({
      cmdId: 2, // Fixed cmdId as per requirement
      data: new TextEncoder().encode(JSON.stringify(payload)).buffer
    });
    
    console.log('Custom text message sent');
    return true;
  } catch (error) {
    console.error("Failed to send custom message:", error);
    return false;
  }
}

/**
 * Send an interrupt signal to the AI
 */
function sendInterruptSignal() {
  if (!trtcClient) return false;
  
  try {
    const messageId = Date.now().toString();
    
    // Create interrupt signal payload
    const payload = {
      type: MESSAGE_TYPES.CUSTOM_INTERRUPT,
      sender: currentUserId,
      receiver: [botUserId],
      payload: {
        id: messageId,
        timestamp: Date.now()
      }
    };
    
    // Send the interrupt through TRTC
    trtcClient.sendCustomMessage({
      cmdId: 2,
      data: new TextEncoder().encode(JSON.stringify(payload)).buffer
    });
    
    console.log('Interrupt signal sent');
    return true;
  } catch (error) {
    console.error("Failed to send interrupt signal:", error);
    return false;
  }
}

/**
 * ===========================================
 * MESSAGE HANDLERS
 * ===========================================
 */

/**
 * Handles TRTC custom messages
 * @param {Object} event - The TRTC event object
 */
function handleTRTCMessage(event) {
  try {
    const jsonData = new TextDecoder().decode(event.data);
    const data = JSON.parse(jsonData);

    switch (data.type) {
      case MESSAGE_TYPES.CONVERSATION:
        handleConversationMessage(data);
        break;
      case MESSAGE_TYPES.STATE_CHANGE:
        handleStateChangeMessage(data);
        break;
      case MESSAGE_TYPES.ERROR_CALLBACK:
        handleErrorCallbackMessage(data);
        break;
      case MESSAGE_TYPES.METRICS_CALLBACK:
        handleMetricsMessage(data);
        break;
      default:
        console.warn(`Unknown message type: ${data.type}`);
    }
  } catch (error) {
    console.error('Error processing TRTC message:', error);
  }
}

/**
 * Handles conversation messages from the AI
 * @param {Object} data - The conversation message data
 */
function handleConversationMessage(data) {
  const sender = data.sender;
  const text = data.payload.text;
  const roundId = data.payload.roundid;
  const isRobot = sender.includes('ai_');
  const end = data.payload.end;

  addMessage(
    sender, 
    text, 
    isRobot ? 'ai' : 'user',
    roundId,
    end
  );
}

/**
 * Handles state change messages from the AI
 * @param {Object} data - The state change message data
 */
function handleStateChangeMessage(data) {
  const state = data.payload.state;
  const stateText = STATE_LABELS[state] || "Unknown State";
  updateStatus('ai', stateText);
}

/**
 * Handles error callback messages from the AI service
 * @param {Object} data - The error callback message data
 */
function handleErrorCallbackMessage(data) {
  try {
    const { payload } = data;
    const { metric, tag } = payload;
    const { roundid, code, message: errorMessage } = tag;
    console.error(`AI Service Error: ${metric} (${code}): ${errorMessage}`);
    
    const displayMessage = `${metric} (${code}): ${errorMessage}`;
    addSystemMessage(displayMessage);
  } catch (error) {
    console.error('Error processing error callback:', error);
  }
}

/**
 * Handles metrics messages from the AI service
 * @param {Object} data - The metrics message data
 */
function handleMetricsMessage(data) {
  try {
    const { payload } = data;
    const { metric, value, tag } = payload;
    recordMetric(metric, value, tag.roundid);
  } catch (error) {
    console.error('Error processing metrics callback:', error);
  }
}

/**
 * ===========================================
 * AUDIO VISUALIZATION
 * ===========================================
 */

// Track previous volume levels for smoother transitions
let prevUserVolume = 0;
let prevAiVolume = 0;
const smoothingFactor = 0.3; // Lower = smoother but less responsive

/**
 * Handle audio volume events for volume visualization
 * @param {Object} event - The audio volume event
 */
function handleAudioVolume(event) {
  event.result.forEach(({ userId, volume }) => {
    // Check if this is the local user (empty userId means local microphone)
    const isLocalUser = userId === '';
    
    if (isLocalUser) {
      // Apply smoothing to volume transitions
      const smoothedVolume = (volume * (1 - smoothingFactor)) + (prevUserVolume * smoothingFactor);
      prevUserVolume = smoothedVolume;
      
      // Update the user's volume bar
      updateVolumeBar('userVolumeBar', smoothedVolume);
    } 
    // Check if this is the AI bot
    else if (userId === botUserId) {
      // Apply smoothing to volume transitions
      const smoothedVolume = (volume * (1 - smoothingFactor)) + (prevAiVolume * smoothingFactor);
      prevAiVolume = smoothedVolume;
      
      // Update the AI's volume bar
      updateVolumeBar('aiVolumeBar', smoothedVolume);
    }
  });
}

/**
 * Update volume bar element based on volume level
 * @param {string} elementId - The ID of the volume bar element
 * @param {number} volume - The volume level (0-100)
 */
function updateVolumeBar(elementId, volume) {
  const volumeBar = document.getElementById(elementId);
  if (volumeBar) {
    // Scale the volume for better visualization
    // Enhanced scaling to make small volumes more noticeable
    let scaledVolume;
    if (volume < 5) {
      // For very low volumes, maintain minimum width
      scaledVolume = 8;
    } else if (volume < 20) {
      // For low volumes, enhanced scaling
      scaledVolume = 8 + (volume * 1.5);
    } else {
      // For medium to high volumes, standard scaling
      scaledVolume = Math.min(volume * 2.5, 100);
    }
    
    // Use smooth transition for all changes
    volumeBar.style.transition = 'width 0.12s cubic-bezier(0.4, 0, 0.2, 1)';
    volumeBar.style.width = `${scaledVolume}%`;
    
    // Add animation class when volume is above threshold
    if (volume > 5) {
      volumeBar.classList.add('active');
    } else {
      volumeBar.classList.remove('active');
    }
  }
}