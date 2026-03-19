/**
 * Message Output Formatter
 * Formats and displays AI response messages
 */

class MessageFormatter {
    constructor() {
        this.linkPattern = /(https?:\/\/[^\s]+)/g;
        this.codePattern = /```(\w+)?\n([\s\S]*?)```/g;
        this.inlineCodePattern = /`([^`]+)`/g;
        this.boldPattern = /\*\*([^*]+)\*\*/g;
        this.italicPattern = /\*([^*]+)\*/g;
    }

    /**
     * Format message content with rich formatting
     */
    format(content) {
        if (!content) return '';
        
        let formatted = this.escapeHtml(content);
        
        // Format code blocks first
        formatted = formatted.replace(this.codePattern, (match, lang, code) => {
            return this.formatCodeBlock(code, lang);
        });
        
        // Format inline code
        formatted = formatted.replace(this.inlineCodePattern, '<code class="inline-code">$1</code>');
        
        // Format bold
        formatted = formatted.replace(this.boldPattern, '<strong>$1</strong>');
        
        // Format italic
        formatted = formatted.replace(this.italicPattern, '<em>$1</em>');
        
        // Format links
        formatted = formatted.replace(this.linkPattern, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        
        // Format line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        
        return formatted;
    }

    /**
     * Format code block with syntax highlighting
     */
    formatCodeBlock(code, language) {
        const langClass = language ? `language-${language}` : '';
        return `
            <div class="code-block">
                <div class="code-header">
                    <span class="code-lang">${language || 'code'}</span>
                    <button class="copy-btn" onclick="copyCode(this)">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                <pre><code class="${langClass}">${this.escapeHtml(code.trim())}</code></pre>
            </div>
        `;
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, char => map[char]);
    }

    /**
     * Format timestamp
     */
    formatTime(date) {
        const now = new Date();
        const msgDate = new Date(date);
        
        const timeStr = msgDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // If same day, just show time
        if (now.toDateString() === msgDate.toDateString()) {
            return timeStr;
        }
        
        // Show date if different day
        const dateStr = msgDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        
        return `${dateStr} ${timeStr}`;
    }

    /**
     * Format message bubble
     */
    formatMessage(message) {
        const { role, content, time, attachments } = message;
        
        return {
            role,
            content: this.format(content),
            time: this.formatTime(time || new Date()),
            attachments: attachments || []
        };
    }

    /**
     * Create typing indicator HTML
     */
    createTypingIndicator() {
        return `
            <div class="message bot typing">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-bubble typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create message HTML
     */
    createMessageHTML(message) {
        const formatted = this.formatMessage(message);
        const avatarIcon = message.role === 'user' ? 'fa-user' : 'fa-robot';
        
        return `
            <div class="message ${message.role}">
                <div class="message-avatar">
                    <i class="fas ${avatarIcon}"></i>
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        <p>${formatted.content}</p>
                    </div>
                    <span class="message-time">${formatted.time}</span>
                </div>
            </div>
        `;
    }

    /**
     * Format error message
     */
    formatError(error) {
        const errorMessages = {
            mm: {
                network: 'အင်တာနက်ချို့ယွင်းပါတယ်။',
                timeout: 'အချိန်ကုန်သွားပါတယ်။',
                unknown: 'အမှားဖြစ်ပါတယ်။'
            },
            eng: {
                network: 'Network error occurred.',
                timeout: 'Request timed out.',
                unknown: 'An error occurred.'
            }
        };
        
        const lang = window.app?.lang || 'eng';
        
        if (error.message.includes('network')) {
            return errorMessages[lang].network;
        } else if (error.message.includes('timeout')) {
            return errorMessages[lang].timeout;
        }
        
        return errorMessages[lang].unknown;
    }

    /**
     * Format success message
     */
    formatSuccess(message, lang = 'eng') {
        const successMessages = {
            mm: {
                saved: 'သိမ်းလိုက်ပါတယ်။',
                deleted: 'ဖျက်လိုက်ပါတယ်။',
                copied: 'ကူးယူလိုက်ပါတယ်။'
            },
            eng: {
                saved: 'Saved successfully!',
                deleted: 'Deleted successfully!',
                copied: 'Copied to clipboard!'
            }
        };
        
        return successMessages[lang][message] || message;
    }
}

// Create global instance
window.messageFormatter = new MessageFormatter();

// Copy code function
function copyCode(btn) {
    const codeBlock = btn.closest('.code-block').querySelector('code');
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
    });
}
