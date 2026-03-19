// Dashboard Page Logic

const dashboardTranslations = {
    mm: {
        dashboard: 'ဒက်ရှ်ဘုတ်',
        usageChart: 'အသုံးပါဝင်မှုပြက်ပါင်းတာ',
        activityBreakdown: 'လှုပ်ရှားမှုများ',
        recentLogs: 'မကြာသောလုပ်ဆောင်မှုများ',
        time: 'အချိန်',
        action: 'လုပ်ဆောင်မှု',
        status: 'အခြေအနေ',
        options: 'ရွေးချယ်စရာများ',
        refresh: 'ပြန်လည်အပ်ဒိတ်ရန်',
        export: 'ထွက်ရှိရန်',
        settings: 'ဆက်တင်များ',
        language: 'ဘာသာစကား',
        close: 'ပိတ်ရန်'
    },
    eng: {
        dashboard: 'Dashboard',
        usageChart: 'Usage Overview',
        activityBreakdown: 'Activity Breakdown',
        recentLogs: 'Recent Logs',
        time: 'Time',
        action: 'Action',
        status: 'Status',
        options: 'Options',
        refresh: 'Refresh',
        export: 'Export',
        settings: 'Settings',
        language: 'Language',
        close: 'Close'
    }
};

function dashboardPage() {
    return {
        // State
        isMenuOpen: false,
        lang: 'mm',
        theme: 'light',
        showSettings: false,
        showOptions: false,
        currentPage: 'dashboard',
        
        // Stats
        stats: [],
        
        // Chart data
        chartData: [],
        
        // Activities
        activities: [],
        
        // Logs
        recentLogs: [],
        
        init() {
            this.loadSettings();
            this.loadDashboardData();
            this.checkScreenSize();
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
        
        // Load dashboard data
        loadDashboardData() {
            // Stats
            this.stats = [
                { id: 'chats', value: '1,234', label: this.getLabel('totalChats'), icon: 'fas fa-comments', color: 'primary' },
                { id: 'messages', value: '12,456', label: this.getLabel('messages'), icon: 'fas fa-envelope', color: 'success' },
                { id: 'users', value: '856', label: this.getLabel('users'), icon: 'fas fa-users', color: 'warning' },
                { id: 'api', value: '45.2K', label: this.getLabel('apiCalls'), icon: 'fas fa-plug', color: 'danger' }

        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.saveSettings();
        },
            ];
            
            // Chart data (last 7 days)
            this.chartData = [
                { label: 'Mon', value: 65 },
                { label: 'Tue', value: 80 },
                { label: 'Wed', value: 45 },
                { label: 'Thu', value: 90 },
                { label: 'Fri', value: 75 },
                { label: 'Sat', value: 55 },
                { label: 'Sun', value: 40 }
            ];
            
            // Activities
            this.activities = [
                { name: 'Chat Messages', value: '45%', icon: 'fas fa-comments' },
                { name: 'API Calls', value: '30%', icon: 'fas fa-plug' },
                { name: 'File Uploads', value: '15%', icon: 'fas fa-upload' },
                { name: 'Other', value: '10%', icon: 'fas fa-ellipsis-h' }
            ];
            
            // Recent logs
            this.recentLogs = [
                { time: '10:08 AM', action: 'User login', status: 'Success', statusClass: 'is-success' },
                { time: '10:05 AM', action: 'API request', status: 'Success', statusClass: 'is-success' },
                { time: '10:02 AM', action: 'Chat message', status: 'Delivered', statusClass: 'is-info' },
                { time: '09:58 AM', action: 'File upload', status: 'Success', statusClass: 'is-success' },
                { time: '09:55 AM', action: 'API request', status: 'Error', statusClass: 'is-danger' }
            ];
        },
        
        // Methods
        refreshData() {
            this.loadDashboardData();
            this.showOptions = false;
        },
        
        exportData() {
            const data = {
                stats: this.stats,
                activities: this.activities,
                logs: this.recentLogs,
                exportedAt: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'dashboard-data.json';
            a.click();
            URL.revokeObjectURL(url);
            this.showOptions = false;
        },
        
        showSettingsDialog() {
            this.showOptions = false;
            this.showSettings = true;
        },
        
        // Language
        setLang(lang) {
            this.lang = lang;
            this.saveSettings();
            this.closeMenu();
            this.loadDashboardData();
        },
        
        getLabel(key) {
            const labels = {
                mm: {
                    totalChats: 'စကားပြောခွင့်များ',
                    messages: 'မေးလ်များ',
                    users: 'အသုံးပါဝင်သူများ',
                    apiCalls: 'API ခေါ်ဆိုမှုများ'
                },
                eng: {
                    totalChats: 'Total Chats',
                    messages: 'Messages',
                    users: 'Active Users',
                    apiCalls: 'API Calls'
                }
            };
            return labels[this.lang][key] || key;
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

window.dashboardPage = dashboardPage;
