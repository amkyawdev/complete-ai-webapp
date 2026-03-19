/**
 * Memory System
 * Persistent memory storage for AI learning
 */

class MemorySystem {
    constructor() {
        this.shortTerm = [];
        this.longTerm = [];
        this.working = [];
        this.maxShortTerm = 10;
        this.maxWorking = 5;
    }

    /**
     * Initialize memory system
     */
    init() {
        this.loadLongTerm();
    }

    /**
     * Add to short-term memory
     */
    addShortTerm(item) {
        this.shortTerm.unshift({
            ...item,
            timestamp: Date.now()
        });
        
        // Keep only max items
        if (this.shortTerm.length > this.maxShortTerm) {
            this.shortTerm.pop();
        }
    }

    /**
     * Add to working memory
     */
    addWorking(item) {
        this.working.unshift({
            ...item,
            timestamp: Date.now()
        });
        
        if (this.working.length > this.maxWorking) {
            this.working.pop();
        }
    }

    /**
     * Consolidate to long-term memory
     */
    consolidateToLongTerm(item) {
        // Check if already exists
        const exists = this.longTerm.find(m => m.key === item.key);
        
        if (!exists) {
            this.longTerm.push({
                ...item,
                timestamp: Date.now(),
                accessCount: 0
            });
            
            this.saveLongTerm();
        }
    }

    /**
     * Retrieve from long-term memory
     */
    retrieve(key) {
        const item = this.longTerm.find(m => m.key === key);
        
        if (item) {
            item.accessCount++;
            this.saveLongTerm();
        }
        
        return item;
    }

    /**
     * Search long-term memory
     */
    search(query) {
        const lowerQuery = query.toLowerCase();
        
        return this.longTerm.filter(m => 
            m.key.toLowerCase().includes(lowerQuery) ||
            (m.value && m.value.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * Get recent memories
     */
    getRecent(limit = 10) {
        return this.longTerm
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    /**
     * Get most accessed memories
     */
    getMostAccessed(limit = 10) {
        return this.longTerm
            .sort((a, b) => b.accessCount - a.accessCount)
            .slice(0, limit);
    }

    /**
     * Clear short-term memory
     */
    clearShortTerm() {
        this.shortTerm = [];
    }

    /**
     * Clear working memory
     */
    clearWorking() {
        this.working = [];
    }

    /**
     * Clear all memories
     */
    clearAll() {
        this.shortTerm = [];
        this.working = [];
        this.longTerm = [];
        this.saveLongTerm();
    }

    /**
     * Save long-term to storage
     */
    saveLongTerm() {
        try {
            localStorage.setItem('amkyawdev_memory_longterm', JSON.stringify(this.longTerm));
        } catch (e) {
            console.error('Save error:', e);
        }
    }

    /**
     * Load long-term from storage
     */
    loadLongTerm() {
        try {
            const saved = localStorage.getItem('amkyawdev_memory_longterm');
            if (saved) {
                this.longTerm = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Load error:', e);
            this.longTerm = [];
        }
    }

    /**
     * Get memory statistics
     */
    getStats() {
        return {
            shortTerm: this.shortTerm.length,
            working: this.working.length,
            longTerm: this.longTerm.length,
            total: this.shortTerm.length + this.working.length + this.longTerm.length
        };
    }

    /**
     * Export all memories
     */
    export() {
        const data = {
            longTerm: this.longTerm,
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `memory-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Import memories
     */
    async import(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.longTerm) {
                this.longTerm = [...this.longTerm, ...data.longTerm];
                this.saveLongTerm();
                return true;
            }
            
            return false;
        } catch (e) {
            console.error('Import error:', e);
            return false;
        }
    }
}

// Create global instance
window.memorySystem = new MemorySystem();

// Initialize
window.memorySystem.init();

// Export for Alpine.js
window.MemoryUtils = {
    stats: () => window.memorySystem.getStats(),
    recent: (limit) => window.memorySystem.getRecent(limit),
    mostAccessed: (limit) => window.memorySystem.getMostAccessed(limit),
    search: (query) => window.memorySystem.search(query),
    clear: () => window.memorySystem.clearAll(),
    export: () => window.memorySystem.export()
};
