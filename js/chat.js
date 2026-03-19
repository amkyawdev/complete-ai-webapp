// Chat Page Logic

// Translation labels
const chatTranslations = {
    mm: {
        messagePlaceholder: 'သင်ပြောလိုသည်ကို ရိုက်လိုက်ပါ...',
        newChat: 'ချန်လှပ်ပါး',
        clearChat: 'စကားပြောခွင့်သန့်ရှင်းရန်',
        exportChat: 'ထွက်ရှိရန်',
        settings: 'ဆက်တင်များ',
        options: 'ရွေးချယ်စရာများ',
        image: 'ပုံ',
        document: 'ဖိုင်',
        language: 'ဘာသာစကား',
        aiModel: 'AI မော်ဒယ်',
        close: 'ပိတ်ရန်'
    },
    eng: {
        messagePlaceholder: 'Type your message...',
        newChat: 'New Chat',
        clearChat: 'Clear Chat',
        exportChat: 'Export Chat',
        settings: 'Settings',
        options: 'Options',
        image: 'Image',
        document: 'Document',
        language: 'Language',
        aiModel: 'AI Model',
        close: 'Close'
    }
};

function chatPage() {
    return {
        // State
        isMenuOpen: false,
        lang: 'mm',
        theme: 'light',
        showSettings: false,
        showOptions: false,
        showAttachments: false,
        showEmojiPicker: false,
        currentPage: 'chat',
        
        // Chat state
        messages: [],
        inputMessage: '',
        isTyping: false,
        showScrollButton: false,
        aiModel: 'gpt-4',
        
        // Initialize
        init() {
            this.loadSettings();
            this.addWelcomeMessage();
            this.setupScrollListener();
            this.checkScreenSize();
            
            // Initialize AI Engine
            if (typeof AIEngine !== 'undefined') {
                window.aiChatEngine = new AIEngine();
                window.aiChatEngine.init();
                console.log('AI Engine connected to chat');
            }
            
            window.addEventListener('resize', () => this.checkScreenSize());
        },
        
        isMobile() {
            return window.innerWidth < 1024;
        },
        
        checkScreenSize() {
            if (window.innerWidth >= 1024 && this.isMenuOpen) {
                this.isMenuOpen = false;
            }
        },
        
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
            if (this.isMenuOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        },
        
        closeMenu() {
            this.isMenuOpen = false;
            document.body.style.overflow = '';
        },
        
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.saveSettings();
        },
        
        // Chat methods
        addWelcomeMessage() {
            const welcomeMsg = this.lang === 'mm' 
                ? 'မင်္ဂလာပါ! ကျွန်တော်က သင့်အတွက် ကူညီပါမယ်။ ဘာများမေးချင်ပါလဲ။'
                : 'Hello! I\'m here to help. What would you like to ask?';
            
            this.messages = [{
                role: 'bot',
                content: welcomeMsg,
                time: this.getCurrentTime()
            }];
        },
        
        getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString(this.lang === 'mm' ? 'my-MM' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        sendMessage() {
            if (!this.inputMessage.trim()) return;
            
            // Add user message
            this.messages.push({
                role: 'user',
                content: this.inputMessage,
                time: this.getCurrentTime()
            });
            
            const userMessage = this.inputMessage;
            this.inputMessage = '';
            
            // Scroll to bottom
            this.$nextTick(() => {
                this.scrollToBottom();
            });
            
            // Simulate typing
            this.isTyping = true;
            
            // Simulate AI response
            setTimeout(() => {
                this.isTyping = false;
                this.addBotResponse(userMessage);
            }, 1500);
        },
        
        addBotResponse(userMessage) {
            // Use AI Engine if available
            if (typeof AIEngine !== 'undefined') {
                const ai = window.aiChatEngine || new AIEngine();
                const response = ai.simulateAIResponse(userMessage);
                
                this.messages.push({
                    role: 'bot',
                    content: response,
                    time: this.getCurrentTime()
                });
            } else {
                // Fallback to static responses
                const responses = {
                    mm: [
                        'ဟုတ်ကဲ့။ ဒါကို ကျွန်တော်နားလည်ပါတယ်။',
                        'သင့်မေးခွန်းကို ဖြေကြားပါမယ်။',
                        'ဒါဟာ အလွန်စိတ်ဝင်စားစွာပါပါ။',
                        'သင့်အတွက် ပါဝင်ပါမယ်။',
                        'ခွင့်လွှတ်ပါ။ ဒါကို သတင်းအရင်းအမြစ်များနဲ့ ရှာဖွေပါမယ်။'
                    ],
                    eng: [
                        'I understand. Let me help you with that.',
                        'That\'s an interesting question. Let me answer it.',
                        'I\'m here to help! Could you provide more details?',
                        'Great question! Here\'s what I know.',
                        'Let me process that information for you.'
                    ]
                };
                
                const langResponses = responses[this.lang];
                const randomResponse = langResponses[Math.floor(Math.random() * langResponses.length)];
                
                this.messages.push({
                    role: 'bot',
                    content: randomResponse,
                    time: this.getCurrentTime()
                });
            }
            
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        
        autoResize(event) {
            const textarea = event.target;
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
        },
        
        scrollToBottom() {
            const container = document.getElementById('chatContainer');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        },
        
        setupScrollListener() {
            const container = document.getElementById('chatContainer');
            if (container) {
                container.addEventListener('scroll', () => {
                    const { scrollTop, scrollHeight, clientHeight } = container;
                    this.showScrollButton = scrollHeight - scrollTop - clientHeight > 300;
                });
            }
        },
        
        attachFile(type) {
            // Simulate file attachment
            const fileType = type === 'image' ? 'image' : 'document';
            alert(`${fileType} attachment feature - coming soon!`);
            this.showAttachments = false;
        },
        
        // Options
        newChat() {
            this.messages = [];
            this.addWelcomeMessage();
            this.showOptions = false;
        },
        
        clearChat() {
            if (confirm(this.lang === 'mm' ? 'စကားပြောခွင့်သန့်ရှင်းရန်လား။' : 'Clear chat history?')) {
                this.messages = [];
                this.addWelcomeMessage();
            }
            this.showOptions = false;
        },
        
        exportChat() {
            let chatText = this.messages.map(m => 
                `${m.role === 'user' ? 'You' : 'AI'}: ${m.content}`
            ).join('\n\n');
            
            const blob = new Blob([chatText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'chat-history.txt';
            a.click();
            URL.revokeObjectURL(url);
            this.showOptions = false;
        },
        
        showSettingsDialog() {
            this.showOptions = false;
            this.showSettings = true;
        },
        
        // Language methods
        setLang(lang) {
            this.lang = lang;
            this.saveSettings();
            this.closeMenu();
            // Add welcome message in new language
            if (this.messages.length <= 1) {
                this.addWelcomeMessage();
            }
        },
        
        getLabel(key) {
            return chatTranslations[this.lang][key] || key;
        },
        
        loadSettings() {
            try {
                const savedLang = localStorage.getItem('amkyawdev_lang');
                const savedTheme = localStorage.getItem('amkyawdev_theme');
                
                if (savedLang) this.lang = savedLang;
                if (savedTheme) this.theme = savedTheme;
                
                if (this.theme === 'dark') {
                    document.body.setAttribute('data-theme', 'dark');
                }
            } catch (e) {
                console.log('LocalStorage not available');
            }
        },
        
        saveSettings() {
            try {
                localStorage.setItem('amkyawdev_lang', this.lang);
                localStorage.setItem('amkyawdev_theme', this.theme);
                
                if (this.theme === 'dark') {
                    document.body.setAttribute('data-theme', 'dark');
                } else {
                    document.body.removeAttribute('data-theme');
                }
            } catch (e) {
                console.log('LocalStorage not available');
            }
        }
    };
}

// Initialize chat page
window.chatPage = chatPage;
