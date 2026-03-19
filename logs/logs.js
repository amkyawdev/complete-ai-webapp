/**
 * Logs System
 * Track and manage application logs
 */

class LogsManager {
    constructor() {
        this.logs = [];
        this.maxLogs = 100;
    }

    /**
     * Initialize logs
     */
    init() {
        this.loadLogs();
    }

    /**
     * Add a log entry
     */
    addLog(level, message) {
        const log = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            level: level,
            message: message
        };

        this.logs.unshift(log);

        // Keep only maxLogs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(0, this.maxLogs);
        }

        this.saveLogs();
        return log;
    }

    /**
     * Log info
     */
    info(message) {
        return this.addLog('info', message);
    }

    /**
     * Log warning
     */
    warning(message) {
        return this.addLog('warning', message);
    }

    /**
     * Log error
     */
    error(message) {
        return this.addLog('error', message);
    }

    /**
     * Log success
     */
    success(message) {
        return this.addLog('success', message);
    }

    /**
     * Get all logs
     */
    getLogs() {
        return this.logs;
    }

    /**
     * Clear all logs
     */
    clearLogs() {
        this.logs = [];
        this.saveLogs();
    }

    /**
     * Save logs to localStorage
     */
    saveLogs() {
        try {
            localStorage.setItem('amkyawdev_logs', JSON.stringify(this.logs));
        } catch (e) {
            console.error('Error saving logs:', e);
        }
    }

    /**
     * Load logs from localStorage
     */
    loadLogs() {
        try {
            const saved = localStorage.getItem('amkyawdev_logs');
            if (saved) {
                this.logs = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Error loading logs:', e);
            this.logs = [];
        }
    }

    /**
     * Export logs to JSON
     */
    exportLogs() {
        const data = JSON.stringify(this.logs, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Filter logs by level
     */
    filterByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }
}

// Create global logs manager
window.logsManager = new LogsManager();

// Initialize logs app for Alpine.js
function logsApp() {
    return {
        logs: [],

        init() {
            this.loadLogs();
        },

        loadLogs() {
            this.logs = window.logsManager.getLogs();
        },

        refreshLogs() {
            this.loadLogs();
        },

        clearLogs() {
            if (confirm('Clear all logs?')) {
                window.logsManager.clearLogs();
                this.loadLogs();
            }
        },

        exportLogs() {
            window.logsManager.exportLogs();
        }
    };
}

window.logsApp = logsApp;
