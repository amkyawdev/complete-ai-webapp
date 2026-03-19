/**
 * Brain Training System
 * AI training and learning functionality
 */

class BrainTrainer {
    constructor() {
        this.memories = [];
        this.patterns = [];
        this.isTraining = false;
        this.loadMemories();
    }

    /**
     * Initialize brain trainer
     */
    init() {
        console.log('Brain Trainer initialized');
        this.loadMemories();
    }

    /**
     * Add new memory
     */
    addMemory(input, output, category = 'general') {
        const memory = {
            id: Date.now(),
            input: input.toLowerCase().trim(),
            output: output,
            category: category,
            createdAt: new Date().toISOString(),
            usageCount: 0
        };
        
        this.memories.push(memory);
        this.extractPattern(memory);
        this.saveMemories();
        
        return memory;
    }

    /**
     * Extract pattern from memory
     */
    extractPattern(memory) {
        // Simple keyword-based pattern extraction
        const words = memory.input.split(/\s+/);
        const keywords = words.filter(w => w.length > 3);
        
        keywords.forEach(keyword => {
            let existingPattern = this.patterns.find(p => p.keyword === keyword);
            
            if (!existingPattern) {
                existingPattern = {
                    keyword: keyword,
                    responses: [],
                    category: memory.category
                };
                this.patterns.push(existingPattern);
            }
            
            // Add response if not exists
            if (!existingPattern.responses.find(r => r.output === memory.output)) {
                existingPattern.responses.push({
                    output: memory.output,
                    count: 1
                });
            }
        });
    }

    /**
     * Find response from memories
     */
    findResponse(input) {
        const normalizedInput = input.toLowerCase().trim();
        
        // Exact match
        const exactMatch = this.memories.find(m => m.input === normalizedInput);
        if (exactMatch) {
            exactMatch.usageCount++;
            this.saveMemories();
            return exactMatch;
        }
        
        // Keyword match
        const words = normalizedInput.split(/\s+/);
        const keywords = words.filter(w => w.length > 3);
        
        let bestMatch = null;
        let maxScore = 0;
        
        keywords.forEach(keyword => {
            const pattern = this.patterns.find(p => p.keyword === keyword);
            if (pattern && pattern.responses.length > 0) {
                // Get most used response
                const response = pattern.responses.sort((a, b) => b.count - a.count)[0];
                const score = keyword.length;
                
                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = {
                        output: response.output,
                        confidence: score / keywords.length
                    };
                }
            }
        });
        
        if (bestMatch) {
            // Increment usage
            const memory = this.memories.find(m => m.output === bestMatch.output);
            if (memory) {
                memory.usageCount++;
                this.saveMemories();
            }
        }
        
        return bestMatch;
    }

    /**
     * Delete memory
     */
    deleteMemory(id) {
        const memory = this.memories.find(m => m.id === id);
        if (memory) {
            this.memories = this.memories.filter(m => m.id !== id);
            
            // Update patterns
            this.patterns.forEach(pattern => {
                pattern.responses = pattern.responses.filter(r => r.output !== memory.output);
            });
            
            // Remove empty patterns
            this.patterns = this.patterns.filter(p => p.responses.length > 0);
            
            this.saveMemories();
        }
    }

    /**
     * Clear all memories
     */
    clearAll() {
        this.memories = [];
        this.patterns = [];
        this.saveMemories();
    }

    /**
     * Export memories
     */
    exportMemories() {
        const data = {
            memories: this.memories,
            patterns: this.patterns,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-brain-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Import memories
     */
    async importMemories(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.memories) {
                data.memories.forEach(m => {
                    if (!this.memories.find(existing => existing.id === m.id)) {
                        this.memories.push(m);
                        this.extractPattern(m);
                    }
                });
                
                this.saveMemories();
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }

    /**
     * Get statistics
     */
    getStats() {
        return {
            totalMemories: this.memories.length,
            trainedPatterns: this.patterns.length,
            lastTraining: this.memories.length > 0 
                ? new Date(this.memories[this.memories.length - 1].createdAt).toLocaleDateString()
                : '-',
            accuracy: this.calculateAccuracy()
        };
    }

    /**
     * Calculate accuracy based on usage
     */
    calculateAccuracy() {
        if (this.memories.length === 0) return 0;
        
        const totalUsage = this.memories.reduce((sum, m) => sum + m.usageCount, 0);
        const usedMemories = this.memories.filter(m => m.usageCount > 0).length;
        
        if (totalUsage === 0) return 0;
        
        return Math.round((usedMemories / this.memories.length) * 100);
    }

    /**
     * Save to localStorage
     */
    saveMemories() {
        try {
            localStorage.setItem('amkyawdev_brain_memories', JSON.stringify(this.memories));
            localStorage.setItem('amkyawdev_brain_patterns', JSON.stringify(this.patterns));
        } catch (e) {
            console.error('Save error:', e);
        }
    }

    /**
     * Load from localStorage
     */
    loadMemories() {
        try {
            const savedMemories = localStorage.getItem('amkyawdev_brain_memories');
            const savedPatterns = localStorage.getItem('amkyawdev_brain_patterns');
            
            if (savedMemories) {
                this.memories = JSON.parse(savedMemories);
            }
            
            if (savedPatterns) {
                this.patterns = JSON.parse(savedPatterns);
            }
        } catch (e) {
            console.error('Load error:', e);
            this.memories = [];
            this.patterns = [];
        }
    }
}

// Create global instance
window.brainTrainer = new BrainTrainer();

// Brain page Alpine.js component
function brainPage() {
    return {
        isMenuOpen: false,
        lang: 'mm',
        currentPage: 'brain',
        
        // Memory state
        memories: [],
        newMemory: {
            input: '',
            output: '',
            category: 'general'
        },
        
        // Test state
        testInput: '',
        testOutput: '',
        
        // Stats
        stats: {
            totalMemories: 0,
            trainedPatterns: 0,
            lastTraining: '-',
            accuracy: 0
        },
        
        init() {
            this.loadSettings();
            this.loadMemories();
            this.updateStats();
        },
        
        isMobile() {
            return window.innerWidth < 1024;
        },
        
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        
        closeMenu() {
            this.isMenuOpen = false;
        },
        
        loadSettings() {
            try {
                const savedLang = localStorage.getItem('amkyawdev_lang');
                if (savedLang) this.lang = savedLang;
            } catch (e) {}
        },
        
        loadMemories() {
            this.memories = window.brainTrainer.memories;
        },
        
        updateStats() {
            this.stats = window.brainTrainer.getStats();
        },
        
        // Training
        trainMemory() {
            if (!this.newMemory.input || !this.newMemory.output) return;
            
            window.brainTrainer.addMemory(
                this.newMemory.input,
                this.newMemory.output,
                this.newMemory.category
            );
            
            this.newMemory = { input: '', output: '', category: 'general' };
            this.loadMemories();
            this.updateStats();
        },
        
        // Testing
        testAI() {
            if (!this.testInput) return;
            
            const result = window.brainTrainer.findResponse(this.testInput);
            
            if (result && result.output) {
                this.testOutput = result.output;
            } else {
                const fallback = this.lang === 'mm' 
                    ? 'ဒါကို မသင်ယူရသေးပါ။ သင်ပါဝင်မှုမှာထည့်ပါ။'
                    : 'I haven\'t learned this yet. Add it to training!';
                
                this.testOutput = fallback;
            }
        },
        
        // Delete
        deleteMemory(id) {
            if (confirm(this.lang === 'mm' ? 'ဖျက်လိုက်ပါသလား။' : 'Delete this memory?')) {
                window.brainTrainer.deleteMemory(id);
                this.loadMemories();
                this.updateStats();
            }
        },
        
        // Export
        exportMemories() {
            window.brainTrainer.exportMemories();
        },
        
        // Helpers
        getCategoryClass(category) {
            const classes = {
                general: 'is-light',
                greeting: 'is-success',
                question: 'is-info',
                command: 'is-warning'
            };
            return classes[category] || 'is-light';
        },
        
        getLabel(key) {
            const labels = {
                mm: {
                    brainTraining: 'AI ဦးနှောက်လေ့ကျင့်ရေး',
                    totalMemories: 'မှတ်ဉာဏ်များ',
                    patterns: 'ပါတ်တာများ',
                    lastTrain: 'နောက်ဆုံးလေ့ကျင့်',
                    accuracy: 'တိကျမှု',
                    addMemory: 'မှတ်ဉာဏ်ထည့်ရန်',
                    inputPattern: 'အသွင်အပြင်',
                    inputPlaceholder: 'သင်္ချာနှင့် မေးလိုသည်ကို ရိုက်လိုက်ပါ...',
                    expectedOutput: 'ထွက်လာမည့်အပိုင်းအစ',
                    outputPlaceholder: 'ဒါကို ဖြေလိုက်ပါ...',
                    category: 'အမျိုးအစား',
                    train: 'လေ့ကျင့်ရန်',
                    testAI: 'AI စမ်းသပ်ရန်',
                    testInput: 'စမ်းသပ်လိုသည်ကို ရိုက်လိုက်ပါ...',
                    test: 'စမ်းသပ်ရန်',
                    memoryList: 'မှတ်ဉာဏ်စာရင်း',
                    noMemories: 'မှတ်ဉာဏ်မရှိပါ။',
                    input: 'အသွင်အပြင်',
                    output: 'အထွက်',
                    actions: 'လုပ်ဆောင်မှုများ'
                },
                eng: {
                    brainTraining: 'AI Brain Training',
                    totalMemories: 'Total Memories',
                    patterns: 'Patterns',
                    lastTrain: 'Last Training',
                    accuracy: 'Accuracy',
                    addMemory: 'Add Memory',
                    inputPattern: 'Input Pattern',
                    inputPlaceholder: 'Enter what to learn...',
                    expectedOutput: 'Expected Output',
                    outputPlaceholder: 'Enter response...',
                    category: 'Category',
                    train: 'Train',
                    testAI: 'Test AI',
                    testInput: 'Test Input',
                    testPlaceholder: 'Enter test message...',
                    test: 'Test',
                    memoryList: 'Memory List',
                    noMemories: 'No memories yet',
                    input: 'Input',
                    output: 'Output',
                    actions: 'Actions'
                }
            };
            
            return labels[this.lang][key] || key;
        }
    };
}

window.brainPage = brainPage;
