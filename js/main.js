// AmkyawDev AI WebApp - Main Application Logic

// Language translations
const translations = {
    mm: {
        greeting: 'မင်္ဂလာပါ',
        subtitle: 'AI အကူအညီပါ။ သင့်အတွက် ပြင်ဆင်ထားပါတယ်',
        start: 'စတင်ရန်',
        chat: 'စကားပြောရန်',
        open: 'ဖွင့်ရန်',
        settings: 'ဆက်တင်များ',
        language: 'ဘာသာစကား',
        theme: 'အသွင်အပြင်',
        close: 'ပိတ်ရန်'
    },
    eng: {
        greeting: 'Welcome',
        subtitle: 'Your AI assistant is ready to help',
        start: 'Get Started',
        chat: 'Start Chatting',
        open: 'Open',
        settings: 'Settings',
        language: 'Language',
        theme: 'Theme',
        close: 'Close'
    }
};

// Features data
const featuresData = {
    mm: [
        { id: 'chat', title: '�က်ရှ်ပါ', description: 'AI နဲ့ စကားပြောဆိုလို့ရပါတယ်', icon: 'fas fa-comments', link: 'pages/chat.html' },
        { id: 'api', title: 'API စမ်းသပ်ခြင်း', description: 'API Endpoint များကို စမ်းသပ်လို့ရပါတယ်', icon: 'fas fa-plug', link: 'pages/endpoint.html' },
        { id: 'dashboard', title: 'ဒက်ရှ်ဘုတ်', description: 'အချက်အလက်များကို ကြည့်ရှုလို့ရပါတယ်', icon: 'fas fa-chart-line', link: 'pages/dashboard.html' },
        { id: 'collections', title: 'ကောက်ချက်များ', description: 'သင်္ချာနှင့် အခြားသော အရာများကို စုစည်းထားပါတယ်', icon: 'fas fa-folder', link: 'pages/collections.html' }
    ],
    eng: [
        { id: 'chat', title: 'AI Chat', description: 'Chat with AI assistant for answers', icon: 'fas fa-comments', link: 'pages/chat.html' },
        { id: 'api', title: 'API Tester', description: 'Test API endpoints easily', icon: 'fas fa-plug', link: 'pages/endpoint.html' },
        { id: 'dashboard', title: 'Dashboard', description: 'View analytics and insights', icon: 'fas fa-chart-line', link: 'pages/dashboard.html' },
        { id: 'collections', title: 'Collections', description: 'Browse math and other resources', icon: 'fas fa-folder', link: 'pages/collections.html' }
    ]
};

// App initialization
function app() {
    return {
        // State
        isMenuOpen: false,
        lang: 'mm',
        theme: 'light',
        showSettings: false,
        currentPage: 'home',
        
        // Computed
        get greeting() {
            return translations[this.lang].greeting;
        },
        
        get subtitle() {
            return translations[this.lang].subtitle;
        },
        
        get features() {
            return featuresData[this.lang];
        },
        
        // Methods
        init() {
            // Load saved settings
            this.loadSettings();
            
            // Detect mobile
            this.checkScreenSize();
            
            // Listen for resize
            window.addEventListener('resize', () => this.checkScreenSize());
        },
        
        isMobile() {
            return window.innerWidth < 1024;
        },
        
        checkScreenSize() {
            // Auto close menu on desktop
            if (window.innerWidth >= 1024 && this.isMenuOpen) {
                this.isMenuOpen = false;
            }
        },
        
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
            
            // Prevent body scroll when menu is open
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
        
        setLang(lang) {
            this.lang = lang;
            this.saveSettings();
            this.closeMenu();
        },
        
        getLabel(key) {
            return translations[this.lang][key] || key;
        },
        
        loadSettings() {
            try {
                const savedLang = localStorage.getItem('amkyawdev_lang');
                const savedTheme = localStorage.getItem('amkyawdev_theme');
                
                if (savedLang) this.lang = savedLang;
                if (savedTheme) this.theme = savedTheme;
                
                // Apply theme
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
                
                // Apply theme
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

// Export for use in other modules
window.app = app;
