// Collections Page Logic

const collectionsTranslations = {
    mm: {
        collections: 'ကောက်ချက်များ',
        searchPlaceholder: 'ရှာဖွေရန်...',
        noItems: 'အမှတ်အသားမရှိပါ။',
        options: 'ရွေးချယ်စရာများ',
        addNew: 'အသစ်ထည့်ရန်',
        settings: 'ဆက်တင်များ',
        open: 'ဖွင့်ရန်',
        share: 'မွမ်းမံရန်',
        edit: 'ပြင်ဆင်ရန်',
        delete: 'ဖျက်ရန်',
        language: 'ဘာသာစကား',
        close: 'ပိတ်ရန်'
    },
    eng: {
        collections: 'Collections',
        searchPlaceholder: 'Search...',
        noItems: 'No items found',
        options: 'Options',
        addNew: 'Add New',
        settings: 'Settings',
        open: 'Open',
        share: 'Share',
        edit: 'Edit',
        delete: 'Delete',
        language: 'Language',
        close: 'Close'
    }
};

function collectionsPage() {
    return {
        // State
        isMenuOpen: false,
        lang: 'mm',
        theme: 'light',
        showSettings: false,
        showOptions: false,
        showItemDialog: false,
        currentPage: 'collections',
        
        // Collections state
        activeCategory: 'all',
        searchQuery: '',
        selectedItem: null,
        allItems: [],
        filteredItems: [],
        
        // Categories
        categories: [
            { id: 'all', name: 'All', icon: 'fas fa-th-large' },
            { id: 'questions', name: 'Questions', icon: 'fas fa-question-circle' },
            { id: 'links', name: 'Web Links', icon: 'fas fa-link' },
            { id: 'text', name: 'Text', icon: 'fas fa-file-alt' },
            { id: 'images', name: 'Images', icon: 'fas fa-image' },
            { id: 'code', name: 'Code', icon: 'fas fa-code' }
        ],
        
        init() {
            this.loadSettings();
            this.loadItems();
            this.filterItems();
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
        
        // Load items
        loadItems() {
            // Sample data - in real app, load from JSON files
            this.allItems = [
                { 
                    id: 1, 
                    title: 'Introduction to AI', 
                    description: 'Learn the basics of artificial intelligence and machine learning',
                    type: 'text',
                    tags: ['AI', 'Beginner', 'Tutorial'],
                    category: 'text'
                },
                { 
                    id: 2, 
                    title: 'Python Programming Quiz', 
                    description: 'Test your Python skills with these questions',
                    type: 'questions',
                    tags: ['Python', 'Quiz', 'Programming'],
                    category: 'questions'
                },
                { 
                    id: 3, 
                    title: 'Machine Learning Resources', 
                    description: 'Best tutorials and courses for ML',
                    type: 'links',
                    tags: ['ML', 'Resources', 'Learning'],
                    category: 'links'
                },
                { 
                    id: 4, 
                    title: 'Code Snippets', 
                    description: 'Useful code snippets for common tasks',
                    type: 'code',
                    tags: ['Code', 'Snippets', 'JavaScript'],
                    category: 'code'
                },
                { 
                    id: 5, 
                    title: 'Photo Gallery', 
                    description: 'Collection of AI-generated images',
                    type: 'images',
                    tags: ['Images', 'Gallery', 'AI Art'],
                    category: 'images'
                },
                { 
                    id: 6, 
                    title: 'Data Science Questions', 
                    description: 'Common data science interview questions',
                    type: 'questions',
                    tags: ['Data Science', 'Interview', 'Questions'],
                    category: 'questions'
                }

        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.saveSettings();
        },
            ];
        },
        
        // Filter items
        filterItems() {
            let items = this.allItems;
            
            // Filter by category
            if (this.activeCategory !== 'all') {
                items = items.filter(item => item.category === this.activeCategory);
            }
            
            // Filter by search
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                items = items.filter(item => 
                    item.title.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query) ||
                    item.tags.some(tag => tag.toLowerCase().includes(query))
                );
            }
            
            this.filteredItems = items;
        },
        
        // Set category
        setCategory(category) {
            this.activeCategory = category;
            this.filterItems();
        },
        
        // Get item icon
        getItemIcon(type) {
            const icons = {
                questions: 'fas fa-question-circle',
                links: 'fas fa-link',
                text: 'fas fa-file-alt',
                images: 'fas fa-image',
                code: 'fas fa-code'
            };
            return icons[type] || 'fas fa-file';
        },
        
        // Open item
        openItem(item) {
            // In a real app, this would open the item or navigate to it
            alert(`Opening: ${item.title}`);
            this.showItemDialog = false;
        },
        
        // Show item options
        showItemOptions(item) {
            this.selectedItem = item;
            this.showItemDialog = true;
        },
        
        // Share item
        shareItem(item) {
            if (navigator.share) {
                navigator.share({
                    title: item.title,
                    text: item.description,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert(this.lang === 'mm' ? 'လင့်ခ်ကူးယူပါပါ။' : 'Link copied to clipboard!');
            }
            this.showItemDialog = false;
        },
        
        // Edit item
        editItem(item) {
            alert(this.lang === 'mm' ? 'ပြင်ဆင်ရန်' : 'Edit item');
            this.showItemDialog = false;
        },
        
        // Delete item
        deleteItem(item) {
            const confirmMsg = this.lang === 'mm' 
                ? 'ဖျက်လိုက်ပါသလား။' 
                : 'Are you sure you want to delete this?';
            
            if (confirm(confirmMsg)) {
                this.allItems = this.allItems.filter(i => i.id !== item.id);
                this.filterItems();
            }
            this.showItemDialog = false;
        },
        
        // Add new item
        addNewItem() {
            alert(this.lang === 'mm' ? 'အသစ်ထည့်ရန်' : 'Add new item');
            this.showOptions = false;
        },
        
        // Options
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
            return collectionsTranslations[this.lang][key] || key;
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

window.collectionsPage = collectionsPage;
