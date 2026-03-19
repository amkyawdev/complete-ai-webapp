/**
 * Network Manager
 * Handles all network requests and API calls
 */

class NetworkManager {
    constructor() {
        this.pendingRequests = new Map();
        this.cache = new Map();
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    /**
     * Make HTTP GET request
     */
    async get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    }

    /**
     * Make HTTP POST request
     */
    async post(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', ...options.headers }
        });
    }

    /**
     * Make HTTP PUT request
     */
    async put(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', ...options.headers }
        });
    }

    /**
     * Make HTTP DELETE request
     */
    async delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }

    /**
     * Main request handler with retry logic
     */
    async request(url, options = {}) {
        const { cache = false, cacheKey = null, retries = this.retryAttempts } = options;
        
        // Check cache first
        if (cache && cacheKey) {
            const cached = this.getFromCache(cacheKey);
            if (cached) return cached;
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.api.timeout || 30000);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the response
            if (cache && cacheKey) {
                this.saveToCache(cacheKey, data);
            }

            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (retries > 0 && this.isNetworkError(error)) {
                await this.delay(this.retryDelay);
                return this.request(url, { ...options, retries: retries - 1 });
            }
            
            throw error;
        }
    }

    /**
     * Check if error is network-related
     */
    isNetworkError(error) {
        return error.name === 'AbortError' || 
               error.message.includes('network') ||
               error.message.includes('fetch');
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get data from cache
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        if (Date.now() > cached.expiry) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    /**
     * Save data to cache
     */
    saveToCache(key, data) {
        const expiry = Date.now() + (CONFIG.performance.cacheExpiry || 3600000);
        this.cache.set(key, { data, expiry });
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Load JSON data
     */
    async loadData(endpoint) {
        try {
            const data = await this.get(endpoint, { cache: true, cacheKey: endpoint });
            return data;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    /**
     * Load multiple endpoints in parallel
     */
    async loadMultiple(endpoints) {
        const promises = endpoints.map(endpoint => this.loadData(endpoint));
        return Promise.allSettled(promises);
    }

    /**
     * Abort all pending requests
     */
    abortAll() {
        this.pendingRequests.forEach((controller, key) => {
            controller.abort();
            this.pendingRequests.delete(key);
        });
    }
}

// Create global instance
window.networkManager = new NetworkManager();
