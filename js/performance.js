/**
 * Performance Optimizer
 * Handles performance optimizations and lazy loading
 */

class PerformanceOptimizer {
    constructor() {
        this.observers = [];
        this.init();
    }

    /**
     * Initialize performance features
     */
    init() {
        this.setupLazyLoading();
        this.setupScrollOptimization();
        this.measurePerformance();
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '50px' });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Setup scroll optimization
     */
    setupScrollOptimization() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        // Dispatch custom scroll event
        window.dispatchEvent(new CustomEvent('optimizedScroll', {
            detail: {
                scrollY: window.scrollY,
                scrollTop: document.documentElement.scrollTop
            }
        }));
    }

    /**
     * Measure page performance
     */
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const timing = window.performance.timing;
                    const metrics = {
                        loadTime: timing.loadEventEnd - timing.navigationStart,
                        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                        firstPaint: this.getFirstPaint(),
                        resourceCount: window.performance.getEntriesByType('resource').length
                    };
                    
                    console.log('Performance Metrics:', metrics);
                    
                    // Store in localStorage for analytics
                    try {
                        localStorage.setItem('amkyawdev_perf', JSON.stringify(metrics));
                    } catch (e) {}
                }, 0);
            });
        }
    }

    /**
     * Get first paint time
     */
    getFirstPaint() {
        if ('performance' in window) {
            const paintEntries = window.performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            return firstPaint ? firstPaint.startTime : 0;
        }
        return 0;
    }

    /**
     * Debounce function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Create intersection observer
     */
    createObserver(callback, options = {}) {
        const observer = new IntersectionObserver(callback, {
            root: options.root || null,
            rootMargin: options.rootMargin || '0px',
            threshold: options.threshold || 0
        });
        
        this.observers.push(observer);
        return observer;
    }

    /**
     * Preload resource
     */
    preloadResource(url, as = 'script') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = as;
        document.head.appendChild(link);
    }

    /**
     * Preload critical resources
     */
    preloadCritical() {
        // Preload main CSS
        this.preloadResource('css/main.css', 'style');
        
        // Preload critical fonts
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                console.log('Fonts loaded');
            });
        }
    }

    /**
     * Clean up observers
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Create global instance
window.performanceOptimizer = new PerformanceOptimizer();

// Export utilities
window.PerformanceUtils = {
    debounce: (func, wait) => window.performanceOptimizer.debounce(func, wait),
    throttle: (func, limit) => window.performanceOptimizer.throttle(func, limit)
};
