// API Endpoint Tester Logic

const endpointTranslations = {
    mm: {
        apiTester: 'API စမ်းသပ်ခြင်း',
        urlPlaceholder: 'URL ရိုက်လိုက်ပါ...',
        send: 'ပါးလွှာရန်',
        headers: 'Header များ',
        key: 'Key',
        value: 'Value',
        addHeader: 'Header ထည့်ရန်',
        body: 'Body',
        bodyPlaceholder: 'Request Body ရိုက်လိုက်ပါ...',
        response: 'ပါးလွှာချက်',
        savedEndpoints: 'သိမ်းထားသော Endpoints',
        saveEndpoint: 'Endpoint သိမ်းရန်',
        name: 'အမည်',
        options: 'ရွေးချယ်စရာများ',
        clearAll: 'အားလုံးသန့်ရှင်းရန်',
        settings: 'ဆက်တင်များ',
        language: 'ဘာသာစကား',
        cancel: 'မလုပ်တော့ပါ',
        close: 'ပိတ်ရန်',
        save: 'သိမ်းရန်'
    },
    eng: {
        apiTester: 'API Tester',
        urlPlaceholder: 'Enter URL...',
        send: 'Send',
        headers: 'Headers',
        key: 'Key',
        value: 'Value',
        addHeader: 'Add Header',
        body: 'Body',
        bodyPlaceholder: 'Enter request body...',
        response: 'Response',
        savedEndpoints: 'Saved Endpoints',
        saveEndpoint: 'Save Endpoint',
        name: 'Name',
        options: 'Options',
        clearAll: 'Clear All',
        settings: 'Settings',
        language: 'Language',
        cancel: 'Cancel',
        close: 'Close',
        save: 'Save'
    }
};

function endpointPage() {
    return {
        // State
        isMenuOpen: false,
        lang: 'mm',
        theme: 'light',
        showSettings: false,
        showOptions: false,
        showSaveDialog: false,
        currentPage: 'endpoint',
        
        // Request state
        method: 'GET',
        url: '',
        headers: [{ key: '', value: '' }],
        requestBody: '',
        showHeaders: true,
        showBody: true,
        
        // Response state
        response: '',
        responseStatus: '',
        responseTime: 0,
        isLoading: false,
        
        // Saved endpoints
        savedEndpoints: [],
        newEndpointName: '',
        
        init() {
            this.loadSettings();
            this.loadSavedEndpoints();
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
        
        // Header management
        addHeader() {
            this.headers.push({ key: '', value: '' });
        },
        
        removeHeader(index) {
            this.headers.splice(index, 1);
            if (this.headers.length === 0) {
                this.addHeader();
            }

        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.saveSettings();
        },
        },
        
        // Send request
        async sendRequest() {
            if (!this.url) return;
            
            this.isLoading = true;
            this.response = '';
            this.responseStatus = '';
            
            const startTime = Date.now();
            
            try {
                const headers = {};
                this.headers.forEach(h => {
                    if (h.key && h.value) {
                        headers[h.key] = h.value;
                    }
                });
                
                const options = {
                    method: this.method,
                    headers: headers
                };
                
                if (this.method !== 'GET' && this.requestBody) {
                    options.body = this.requestBody;
                }
                
                const res = await fetch(this.url, options);
                this.responseStatus = res.status + ' ' + res.statusText;
                
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const json = await res.json();
                    this.response = JSON.stringify(json, null, 2);
                } else {
                    this.response = await res.text();
                }
                
                this.responseTime = Date.now() - startTime;
            } catch (error) {
                this.responseStatus = 'Error';
                this.response = 'Error: ' + error.message;
                this.responseTime = Date.now() - startTime;
            }
            
            this.isLoading = false;
        },
        
        // Response status class
        get responseStatusClass() {
            if (!this.responseStatus) return '';
            const status = this.responseStatus.split(' ')[0];
            if (status.startsWith('2')) return 'is-success';
            if (status.startsWith('3')) return 'is-warning';
            if (status.startsWith('4') || status.startsWith('5')) return 'is-danger';
            return 'is-info';
        },
        
        // Method class
        methodClass(method) {
            return 'method-' + method;
        },
        
        // Copy response
        copyResponse() {
            navigator.clipboard.writeText(this.response);
        },
        
        // Save endpoint
        saveEndpoint() {
            if (!this.newEndpointName || !this.url) return;
            
            const endpoint = {
                id: Date.now(),
                name: this.newEndpointName,
                url: this.url,
                method: this.method
            };
            
            this.savedEndpoints.push(endpoint);
            this.saveSavedEndpoints();
            this.newEndpointName = '';
            this.showSaveDialog = false;
        },
        
        // Load endpoint
        loadEndpoint(endpoint) {
            this.method = endpoint.method;
            this.url = endpoint.url;
        },
        
        // Delete endpoint
        deleteEndpoint(id) {
            this.savedEndpoints = this.savedEndpoints.filter(e => e.id !== id);
            this.saveSavedEndpoints();
        },
        
        // Local storage
        loadSavedEndpoints() {
            try {
                const saved = localStorage.getItem('amkyawdev_endpoints');
                if (saved) {
                    this.savedEndpoints = JSON.parse(saved);
                }
            } catch (e) {
                console.log('LocalStorage not available');
            }
        },
        
        saveSavedEndpoints() {
            try {
                localStorage.setItem('amkyawdev_endpoints', JSON.stringify(this.savedEndpoints));
            } catch (e) {
                console.log('LocalStorage not available');
            }
        },
        
        // Options
        clearAll() {
            this.method = 'GET';
            this.url = '';
            this.headers = [{ key: '', value: '' }];
            this.requestBody = '';
            this.response = '';
            this.responseStatus = '';
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
        },
        
        getLabel(key) {
            return endpointTranslations[this.lang][key] || key;
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

window.endpointPage = endpointPage;
