/**
 * Application constants
 */

// API base URL for server communication
const API_BASE_URL = window.location.origin;

// AI states for UI display
const AI_STATES = {
  LISTENING: 1,
  THINKING: 2,
  SPEAKING: 3,
  INTERRUPT: 4
};

// User-friendly state labels for UI display
const STATE_LABELS = {
  [AI_STATES.LISTENING]: "👂 Listening",
  [AI_STATES.THINKING]: "💭 Thinking",
  [AI_STATES.SPEAKING]: "💬 Speaking",
  [AI_STATES.INTERRUPT]: "⚡️ Interrupt"
};

// Message types for TRTC custom messages
const MESSAGE_TYPES = {
  CONVERSATION: 10000,
  STATE_CHANGE: 10001,
  CUSTOM_TEXT: 20000,
  CUSTOM_INTERRUPT: 20001,
  ERROR_CALLBACK: 10030,
  METRICS_CALLBACK: 10020
}; 