/**
 * AI Utilities
 * Helper functions for AI operations
 */

const AIUtils = {
    /**
     * Detect language from text
     */
    detectLanguage(text) {
        // Myanmar Unicode ranges
        const myanmarPattern = /[\u1000-\u109F\uAA60-\uAA7F\u19E0-\u19FF]/;
        
        if (myanmarPattern.test(text)) {
            return 'mm';
        }
        
        // Check for Myanmar-specific characters
        const myanmarChars = text.match(/[က-၏]/g);
        if (myanmarChars && myanmarChars.length > text.length * 0.3) {
            return 'mm';
        }
        
        return 'eng';
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Get greeting based on time
     */
    getGreeting(lang = 'eng') {
        const hour = new Date().getHours();
        
        const greetings = {
            mm: {
                morning: 'မနက်ဖြန်ပါ',
                afternoon: 'နေ့လည်ပါ',
                evening: 'ညနေပါ'
            },
            eng: {
                morning: 'Good Morning',
                afternoon: 'Good Afternoon',
                evening: 'Good Evening'
            }
        };
        
        let timeOfDay;
        if (hour < 12) timeOfDay = 'morning';
        else if (hour < 17) timeOfDay = 'afternoon';
        else timeOfDay = 'evening';
        
        return greetings[lang][timeOfDay];
    },

    /**
     * Simple keyword extraction
     */
    extractKeywords(text, maxKeywords = 5) {
        const stopWords = {
            mm: ['နဲ့', 'နှင့်', 'အတွက်', 'သည်', 'ပါတယ်', 'ဟုတ်ပါတယ်'],
            eng: ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
        };
        
        const lang = this.detectLanguage(text);
        const words = text.toLowerCase().split(/\s+/);
        
        const filtered = words.filter(word => 
            word.length > 2 && !stopWords[lang].includes(word)
        );
        
        // Count frequency
        const frequency = {};
        filtered.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });
        
        // Sort by frequency and return top keywords
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, maxKeywords)
            .map(([word]) => word);
    },

    /**
     * Validate message
     */
    validateMessage(message) {
        if (!message || typeof message !== 'string') {
            return { valid: false, error: 'Empty message' };
        }
        
        if (message.length > CONFIG.chat.maxMessageLength) {
            return { valid: false, error: 'Message too long' };
        }
        
        return { valid: true };
    },

    /**
     * Create quick reply suggestions
     */
    getQuickReplies(lang = 'eng') {
        const quickReplies = {
            mm: [
                'မင်္ဂလာပါ',
                'ဘာလဲ။',
                'ကူညီပါ။',
                'ပါဝင်မှုများ'
            ],
            eng: [
                'Hello',
                'How are you?',
                'Help me',
                'Show features'
            ]
        };
        
        return quickReplies[lang] || quickReplies.eng;
    },

    /**
     * Parse command from message
     */
    parseCommand(message) {
        const commands = {
            mm: {
                'သန့်ရှင်း': 'clear',
                'ထွက်ရှိ': 'export',
                'ပါးလွှာ': 'send',
                'ကူးယူ': 'copy'
            },
            eng: {
                'clear': 'clear',
                'export': 'export',
                'send': 'send',
                'copy': 'copy',
                '/clear': 'clear',
                '/export': 'export',
                '/help': 'help'
            }
        };
        
        const lang = this.detectLanguage(message);
        const lowerMsg = message.toLowerCase().trim();
        
        // Check for commands
        if (commands[lang]) {
            for (const [cmd, action] of Object.entries(commands[lang])) {
                if (lowerMsg.startsWith(cmd)) {
                    return { action, args: message.slice(cmd.length).trim() };
                }
            }
        }
        
        return { action: 'chat', args: message };
    },

    /**
     * Format bytes to human readable
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Get random array item
     */
    randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Shuffle array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Deep clone object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Check if running in browser
     */
    isBrowser() {
        return typeof window !== 'undefined' && typeof document !== 'undefined';
    },

    /**
     * Get browser info
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        
        return {
            browser: /Chrome/.test(ua) ? 'Chrome' : 
                     /Firefox/.test(ua) ? 'Firefox' : 
                     /Safari/.test(ua) ? 'Safari' : 'Unknown',
            os: /Windows/.test(ua) ? 'Windows' : 
                /Mac/.test(ua) ? 'Mac' : 
                /Linux/.test(ua) ? 'Linux' : 'Unknown',
            mobile: /Mobile/.test(ua),
            language: navigator.language
        };
    }
};

// Export utilities
window.AIUtils = AIUtils;
