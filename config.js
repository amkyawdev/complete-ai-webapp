/**
 * AmkyawDev AI WebApp Configuration
 * Main configuration file for the application
 */

const CONFIG = {
    // App Info
    app: {
        name: 'AmkyawDev AI',
        version: '1.0.0',
        author: 'AmkyawDev',
        description: 'AI WebApp with Myanmar & English support'
    },

    // Language Settings
    language: {
        default: 'mm',
        supported: ['mm', 'eng'],
        names: {
            mm: '🇲🇲 မြန်မာ',
            eng: '🇬🇧 English'
        }
    },

    // API Settings
    api: {
        // AI API endpoints (configurable)
        aiEndpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7,
        
        // Fallback responses when API is unavailable
        useLocalFallback: true,
        
        // Request timeout (ms)
        timeout: 30000
    },

    // Chat Settings
    chat: {
        maxMessages: 100,
        maxMessageLength: 5000,
        typingIndicatorDelay: 500,
        autoScroll: true,
        saveHistory: true,
        historyKey: 'amkyawdev_chat_history'
    },

    // UI Settings
    ui: {
        theme: 'light',
        primaryColor: '#6366f1',
        secondaryColor: '#ec4899',
        animationDuration: 300,
        enableAnimations: true,
        responsiveBreakpoint: 1024
    },

    // Storage Settings
    storage: {
        prefix: 'amkyawdev_',
        encrypt: false
    },

    // Performance Settings
    performance: {
        enableCache: true,
        cacheExpiry: 3600000, // 1 hour
        lazyLoadImages: true,
        debounceDelay: 300
    },

    // Features
    features: {
        voiceInput: false,
        imageUpload: false,
        fileExport: true,
        darkMode: true,
        notifications: false
    },

    // Data endpoints
    data: {
        mm: {
            chat: '/data/mm/chat.json',
            webLink: '/data/mm/web-link.json',
            textWebLink: '/data/mm/text-web-link.json',
            imgWebLink: '/data/mm/img-web-link.json',
            coderWebLink: '/data/mm/coder-web-link.json'
        },
        eng: {
            chat: '/data/eng/chat.json',
            knowledgeWebLink: '/data/eng/knowledge-web-link.json',
            textWebLink: '/data/eng/text-web-link.json',
            imgWebLink: '/data/eng/img-web-link.json',
            coderWebLink: '/data/eng/coder-web-link.json'
        }
    }
};

// Export for use in other files
window.APP_CONFIG = CONFIG;
