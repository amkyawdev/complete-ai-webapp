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
    }

    /**
     * Initialize the AI engine
     */
    init() {
        console.log('AI Engine initialized');
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
     * Generate response from AI
     */
    async generateResponse(userMessage) {
        this.addMessage('user', userMessage);
        
        // Simulate AI response (in production, this would call an actual AI API)
        const response = await this.simulateAIResponse(userMessage);
        
        this.addMessage('assistant', response);
        return response;
    }

    /**
     * Simulate AI response
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
