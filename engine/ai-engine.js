/**
 * AmkyawDev AI Engine
 * Core AI logic for the web application
 */

class AIEngine {
    constructor() {
        this.model = 'gpt-3.5';
        this.temperature = 0.7;
        this.maxTokens = 1000;
        this.conversationHistory = [];
        this.data = { mm: {}, eng: {} };
        this.currentLang = 'mm';
    }

    /**
     * Initialize the AI engine
     */
    async init() {
        console.log('AI Engine initializing...');
        await this.loadData();
        this.loadBrainMemories();
        console.log('AI Engine initialized with data and brain memories');
    }

    /**
     * Load data from JSON files
     */
    async loadData() {
        try {
            // Determine correct path based on current location
            const isInPages = window.location.pathname.includes('/pages/');
            const basePath = isInPages ? '../' : './';
            
            // Load Myanmar data
            const mmChatRes = await fetch(basePath + 'data/mm/chat.json');
            this.data.mm.chat = await mmChatRes.json();
            
            const mmWebLinkRes = await fetch(basePath + 'data/mm/web-link.json');
            this.data.mm.webLink = await mmWebLinkRes.json();
            
            // Load English data
            const engChatRes = await fetch(basePath + 'data/eng/chat.json');
            this.data.eng.chat = await engChatRes.json();
            
            const engWebLinkRes = await fetch(basePath + 'data/eng/knowledge-web-link.json');
            this.data.eng.webLink = await engWebLinkRes.json();
            
            console.log('Data loaded successfully from', basePath + 'data/');
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    /**
     * Set current language
     */
    setLanguage(lang) {
        this.currentLang = lang === 'mm' || lang === 'eng' ? lang : 'mm';
    }

    /**
     * Load brain memories
     */
    loadBrainMemories() {
        try {
            // Key from brain.js
            const brainData = localStorage.getItem('amkyawdev_brain_memories');
            if (brainData) {
                const memories = JSON.parse(brainData);
                if (memories && Array.isArray(memories) && memories.length > 0) {
                    // Add brain memories to data
                    const brainMemories = memories.map(m => ({
                        input: m.input,
                        output: m.output,
                        category: m.category || 'brain'
                    }));
                    
                    // Merge with existing data
                    if (!this.data.mm.chat) this.data.mm.chat = {};
                    if (!this.data.eng.chat) this.data.eng.chat = {};
                    
                    this.data.mm.chat.brain = brainMemories;
                    this.data.eng.chat.brain = brainMemories;
                    
                    console.log('Brain memories loaded:', memories.length);
                }
            }
        } catch (error) {
            console.error('Error loading brain memories:', error);
        }
    }

    /**
     * Reload brain memories (call this when memories are updated)
     */
    reloadBrainMemories() {
        this.loadBrainMemories();
    }

    /**
     * Get categories from data
     */
    getCategories(lang) {
        const langData = this.data[lang];
        if (!langData.chat) return [];
        return Object.keys(langData.chat);
    }

    /**
     * Set the AI model
     */
    setModel(model) {
        this.model = model;
    }

    /**
     * Set temperature
     */
    setTemperature(temp) {
        this.temperature = temp;
    }

    /**
     * Add message to conversation history
     */
    addMessage(role, content) {
        this.conversationHistory.push({ role, content, timestamp: Date.now() });
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Search data for matching response
     */
    searchData(query, lang) {
        const langData = this.data[lang];
        if (!langData || !langData.chat) {
            console.log('No chat data for lang:', lang, this.data);
            return null;
        }
        
        const chatData = langData.chat;
        const lowerQuery = query.toLowerCase();
        
        console.log('Searching for:', lowerQuery, 'in', lang);
        console.log('Categories:', Object.keys(chatData));
        
        // Search through all categories
        for (const category of Object.keys(chatData)) {
            const items = chatData[category];
            if (Array.isArray(items)) {
                for (const item of items) {
                    if (item.input && item.output) {
                        const inputLower = item.input.toLowerCase();
                        // Check for exact or partial match
                        if (lowerQuery.includes(inputLower) || inputLower.includes(lowerQuery)) {
                            console.log('Found match:', item.input, '->', item.output);
                            return {
                                output: item.output,
                                category: category,
                                matched: item.input
                            };
                        }
                    }
                }
            }
        }
        
        console.log('No match found for:', lowerQuery);
        // If no match found, return null
        return null;
    }

    /**
     * Generate response from AI
     */
    async generateResponse(userMessage) {
        this.addMessage('user', userMessage);
        
        // Detect language
        const lang = this.detectLanguage(userMessage);
        this.setLanguage(lang);
        
        // Search data first
        const dataResult = this.searchData(userMessage, lang);
        
        let response;
        if (dataResult) {
            response = dataResult.output;
        } else {
            // Fallback to simulated response
            response = await this.simulateAIResponse(userMessage);
        }
        
        this.addMessage('assistant', response);
        return response;
    }

    /**
     * Simulate AI response (fallback)
     */
    simulateAIResponse(input) {
        const responses = {
            mm: [
                'ဟုတ်ကဲ့။ ဒါကို ကျွန်တော်နားလည်ပါတယ်။',
                'သင့်မေးခွန်းကို ဖြေကြားပါမယ်။',
                'ဒါဟာ အလွန်စိတ်ဝင်စားစွာပါပါ။',
                'ကျွန်တော်က ဒါကို သတင်းအရင်းအမြစ်များနဲ့ ရှာဖွေပါမယ်။'
            ],
            eng: [
                'I understand. Let me help you with that.',
                'That\'s an interesting question. Let me answer it.',
                'I\'m here to help! Could you provide more details?',
                'Great question! Here\'s what I know.',
                'Let me process that information for you.'
            ]
        };

        // Detect language (simplified)
        const lang = this.detectLanguage(input);
        const langResponses = responses[lang];
        return langResponses[Math.floor(Math.random() * langResponses.length)];
    }

    /**
     * Detect language
     */
    detectLanguage(text) {
        // Simple Myanmar unicode range detection
        const myanmarPattern = /[\u1000-\u109F\uAA60-\uAA7F]/;
        return myanmarPattern.test(text) ? 'mm' : 'eng';
    }

    /**
     * Process user query
     */
    async processQuery(query, options = {}) {
        const {
            context = '',
            language = 'auto',
            stream = false
        } = options;

        // Build prompt
        let prompt = query;
        if (context) {
            prompt = `Context: ${context}\n\nQuestion: ${query}`;
        }

        // Generate response
        return await this.generateResponse(prompt);
    }

    /**
     * Get chat completion
     */
    async getChatCompletion(messages) {
        // This would normally call an actual AI API
        const lastMessage = messages[messages.length - 1];
        return await this.generateResponse(lastMessage.content);
    }

    /**
     * Analyze text sentiment
     */
    analyzeSentiment(text) {
        // Simple sentiment analysis (placeholder)
        const positiveWords = ['good', 'great', 'excellent', 'happy', 'love', 'ကောင်း', 'သော'];
        const negativeWords = ['bad', 'poor', 'terrible', 'sad', 'hate', 'မကောင်း', 'ဆိုး'];
        
        const lowerText = text.toLowerCase();
        let score = 0;
        
        positiveWords.forEach(word => {
            if (lowerText.includes(word)) score++;
        });
        
        negativeWords.forEach(word => {
            if (lowerText.includes(word)) score--;
        });
        
        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    }

    /**
     * Extract keywords from text
     */
    extractKeywords(text) {
        const words = text.toLowerCase().split(/\s+/);
        const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'နဲ့', 'နှင့်', 'အတွက်', 'သည်', 'ပါတယ်'];
        
        return words.filter(word => 
            word.length > 2 && !stopWords.includes(word)
        ).slice(0, 10);
    }

    /**
     * Summarize text
     */
    summarize(text, maxLength = 100) {
        // Simple extractive summarization
        const sentences = text.split(/[.!?]+/);
        if (sentences.length <= 1) return text;
        
        // Return first sentence as summary
        return sentences[0].trim() + (text.length > maxLength ? '...' : '');
    }
}

// Export the AI Engine
window.AIEngine = AIEngine;

// Initialize default instance
window.aiEngine = new AIEngine();
