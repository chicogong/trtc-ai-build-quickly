/**
 * UI module for handling the user interface interactions
 */

// DOM Elements
const chatListElement = document.querySelector(".chat-list");
const startButton = document.getElementById("start-button");
const endButton = document.getElementById("end-button");
const textInput = document.getElementById("text-input");
const sendButton = document.getElementById("send-button");
const interruptButton = document.getElementById("interrupt-button");
const muteButton = document.getElementById("mute-button");

// Chat messages array
let messages = [];

/**
 * Renders the chat messages in the UI
 */
function renderChatMessages() {
  const fragment = document.createDocumentFragment();

  messages.forEach(message => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-item", message.type);

    const senderElement = document.createElement("div");
    senderElement.classList.add("chat-id");
    senderElement.textContent = message.sender;

    const contentElement = document.createElement("div");
    contentElement.classList.add("chat-text");
    contentElement.textContent = message.content;

    messageElement.appendChild(senderElement);
    messageElement.appendChild(contentElement);
    fragment.appendChild(messageElement);
  });

  chatListElement.innerHTML = "";
  chatListElement.appendChild(fragment);
}

/**
 * Updates the status indicators in the UI
 * @param {string} type - The type of status to update ('ai' or 'room')
 * @param {string} statusText - The status text to display
 */
function updateStatus(type, statusText) {
  const element = type === 'ai' ?
          document.getElementById('ai-state') :
          document.getElementById('room-status');

  if (element) {
    element.textContent = statusText;
  } else {
    console.warn(`Status element for type '${type}' not found`);
  }
}

/**
 * Adds a message to the chat
 * @param {string} sender - The sender of the message
 * @param {string} content - The message content
 * @param {string} type - The message type ('user' or 'ai')
 * @param {string} id - The message ID
 * @param {boolean} end - Whether this is the end of the message
 */
function addMessage(sender, content, type, id, end = true) {
  const existingMessage = messages.find(
    msg => msg.id === id && msg.sender === sender
  );

  if (existingMessage) {
    existingMessage.content = content;
    existingMessage.end = end;
  } else {
    messages.unshift({
      id,
      content,
      sender,
      type,
      end
    });
  }

  renderChatMessages();
}

/**
 * Adds a system message to the chat
 * @param {string} content - The message content
 * @param {boolean} isHTML - Whether the content is HTML that should be rendered
 */
function addSystemMessage(content, isHTML = false) {
  const chatList = document.querySelector('.chat-list');
  const chatItem = document.createElement('div');
  chatItem.className = 'chat-item ai';
  
  const chatId = document.createElement('div');
  chatId.className = 'chat-id';
  chatId.textContent = 'System';
  
  const chatText = document.createElement('div');
  chatText.className = 'chat-text';
  
  if (isHTML) {
    chatText.innerHTML = content;
  } else {
    chatText.textContent = content;
  }
  
  chatItem.appendChild(chatId);
  chatItem.appendChild(chatText);
  chatList.insertBefore(chatItem, chatList.firstChild);
}

/**
 * Reset the UI state
 */
function resetUI() {
  startButton.disabled = false;
  endButton.disabled = true;
  sendButton.disabled = true;
  interruptButton.disabled = true;
  updateStatus('room', "Disconnected");
  updateStatus('ai', "AI NotReady");
} 