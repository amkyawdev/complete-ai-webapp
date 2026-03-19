# AmkyawDev AI WebApp

A modern AI web application built with Bulma CSS and Alpine.js, featuring Myanmar (🇲🇲) and English (🇬🇧) language support.

## Features

- **Modern UI Design** - Clean, responsive interface with gradient colors
- **Mobile-First** - Hamburger menu for mobile, sidebar for desktop
- **Dialog System** - Smooth modal dialogs for options and settings
- **Touch Optimized** - Smooth touch interactions for mobile devices
- **Bilingual** - Full Myanmar and English language support
- **AI Training System** - Train and customize AI responses
- **Multiple Pages** - Home, Chat, API Tester, Dashboard, Collections
- **Network Manager** - Advanced API handling with caching
- **Performance Optimized** - Lazy loading and performance monitoring
- **CSS Animations** - Smooth transitions and animations

## Pages

- `index.html` - Landing page with welcome hero
- `pages/main.html` - Main home page with search
- `pages/chat.html` - AI chat interface
- `pages/endpoint.html` - API endpoint tester
- `pages/dashboard.html` - Analytics dashboard
- `pages/collections.html` - Data collections browser
- `brain/brain.html` - AI training and learning system

## Tech Stack

- **Bulma CSS** - Modern CSS framework
- **Alpine.js** - Lightweight JavaScript framework
- **Font Awesome** - Icon library

## Getting Started

Simply open `index.html` in your browser.

## Project Structure

```
ai-web/
├── index.html              # Entry point
├── config.js              # Configuration file
├── pages/                 # HTML pages
├── css/                   # Stylesheets
│   ├── main.css
│   ├── chat.css
│   ├── endpoint.css
│   ├── collections.css
│   └── animations.css
├── js/                    # JavaScript files
│   ├── main.js
│   ├── chat.js
│   ├── endpoint.js
│   ├── collections.js
│   ├── network.js
│   └── performance.js
├── data/                  # JSON data files
│   ├── mm/               # Myanmar data
│   │   ├── chat.json
│   │   ├── web-link.json
│   │   ├── text-web-link.json
│   │   ├── img-web-link.json
│   │   └── coder-web-link.json
│   └── eng/              # English data
│       ├── chat.json
│       ├── knowledge-web-link.json
│       ├── text-web-link.json
│       ├── img-web-link.json
│       └── coder-web-link.json
├── engine/                # Core engines
│   ├── ai-engine.js
│   ├── msg-output.js
│   └── ai-utils.js
└── brain/                # AI training system
    ├── brain.html
    ├── brain.js
    └── memory.js
```

## License

MIT
