export default [
  {
    ignores: ['node_modules/**', 'ai_gen_servers/**', 'eslint.config.js']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
        // Node.js globals
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        exports: 'readonly',
        // App globals - constants.js
        API_BASE_URL: 'readonly',
        TRTC: 'readonly',
        MESSAGE_TYPES: 'readonly',
        STATE_LABELS: 'readonly',
        // App globals - ui.js
        startButton: 'readonly',
        endButton: 'readonly',
        sendButton: 'readonly',
        interruptButton: 'readonly',
        muteButton: 'readonly',
        textInput: 'readonly',
        // App functions - api.js
        initChatConfig: 'readonly',
        startAIConversation: 'readonly',
        stopAIConversation: 'readonly',
        sendMessage: 'readonly',
        // App functions - ui.js
        updateStatus: 'readonly',
        addMessage: 'readonly',
        addSystemMessage: 'readonly',
        resetUI: 'readonly',
        // App functions - agent-card.js
        updateAgentCard: 'readonly',
        // App functions - trtc-client.js
        initializeTRTC: 'readonly',
        joinRoom: 'readonly',
        leaveRoom: 'readonly',
        toggleMute: 'readonly',
        sendInterruptSignal: 'readonly',
        sendCustomTextMessage: 'readonly',
        destroyTRTCClient: 'readonly',
        displayLatencyStatistics: 'readonly',
        setUserIds: 'readonly',
        enterTRTCRoom: 'readonly',
        exitTRTCRoom: 'readonly',
        // App functions - metrics.js
        recordMetric: 'readonly',
        resetMetrics: 'readonly'
      }
    },
    rules: {
      // Error prevention
      'no-undef': 'error',
      'no-unused-vars': 'off',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      
      // Code style
      'semi': ['error', 'always'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'comma-dangle': ['warn', 'never'],
      
      // Best practices - allow console.log for this project
      'no-console': 'off',
      'curly': ['error', 'all'],
      'no-throw-literal': 'error',
      
      // Disabled for this project
      'no-prototype-builtins': 'off'
    }
  }
];
