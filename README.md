# 🔐 CyberSec AI Terminal

A comprehensive cybersecurity platform featuring AI-powered chat interfaces for specialized security domains and malware file analysis capabilities.

## 🌟 Overview

This project is a React-based application that provides specialized AI consultants for various cybersecurity domains. It integrates with Anthropic's Claude API to provide expert guidance in areas like penetration testing, incident response, web application security, and malware analysis.

## 🎯 Key Features

### AI-Powered Security Chat Interfaces
- **General Terminal** - All-purpose cybersecurity consultant
- **RedTeam Operations** - Offensive security and penetration testing specialist
- **BlueTeam Defense** - Defensive security and incident response specialist
- **Web Analysis** - Web application security specialist
- **Malware Analysis Chat** - Malware analysis and reverse engineering specialist

### Malware File Analysis
- **Multi-Platform Analysis** - Analyze files against VirusTotal, Hybrid Analysis, and MalwareBazaar
- **Client-Side Hashing** - SHA256 computed using Web Crypto API
- **Smart Analysis** - Hash lookup first, upload only if not found
- **Real-Time Results** - Progressive result display with detailed findings

## 🛠️ Tech Stack

- **React 19** - Modern UI library with latest features
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing for SPA navigation
- **React Context** - State management for API keys and chat state

## 📁 Project Structure

```
cybersec-site/
└── react-cybersec-site/          # Main React application
    ├── src/
    │   ├── components/            # Reusable UI components
    │   │   ├── ApiKeyBar.tsx     # API key management interface
    │   │   ├── AsciiLogo.tsx     # ASCII art logo component
    │   │   ├── ChatInterface.tsx # Main chat UI component
    │   │   ├── QuickChips.tsx    # Quick query suggestions
    │   │   ├── Sidebar.tsx       # Navigation sidebar
    │   │   ├── StatusBar.tsx     # Status information bar
    │   │   └── MalwareAnalysis.tsx # File analysis component
    │   ├── context/              # React Context for state
    │   │   └── AppContext.tsx    # Global application state
    │   ├── pages/                # Page components for routes
    │   │   ├── Terminal.tsx      # General cybersecurity chat
    │   │   ├── RedTeam.tsx       # Offensive security chat
    │   │   ├── BlueTeam.tsx      # Defensive security chat
    │   │   ├── WebAnalysis.tsx   # Web security chat
    │   │   └── MalwareAnalysis.tsx # Malware analysis chat
    │   ├── types/                # TypeScript type definitions
    │   │   └── index.ts         # Shared interfaces
    │   ├── utils/                # Utility functions
    │   │   ├── api.ts            # API integration layer
    │   │   ├── format.ts         # Text formatting utilities
    │   │   └── systemPrompts.ts  # AI system prompts
    │   ├── App.tsx               # Main app with routing
    │   └── main.tsx              # Application entry point
    ├── package.json              # Dependencies and scripts
    ├── vite.config.ts           # Vite configuration
    ├── tailwind.config.js        # Tailwind CSS configuration
    └── tsconfig.json             # TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to the React project:**
   ```bash
   cd react-cybersec-site
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🔑 API Keys Setup

### Anthropic API (Chat Features)

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Enter in the app's API key field at the top of the page

**Free Tier:** Varies by usage model

### VirusTotal API (File Analysis)

1. Visit [VirusTotal](https://www.virustotal.com/)
2. Sign up for a free account
3. Go to [API Key Settings](https://www.virustotal.com/gui/my-api-key)
4. Copy your API key
5. Enter in the app when prompted (during file analysis)

**Free Tier:** 500 requests/day, 4 requests/minute

### Hybrid Analysis API (File Analysis)

1. Visit [CrowdStrike Hybrid Analysis](https://www.hybrid-analysis.com/)
2. Sign up for a free account
3. Go to [API Settings](https://www.hybrid-analysis.com/profile/api)
4. Copy your API key
5. Enter in the app when prompted (during file analysis)

**Free Tier:** 25 analyses/day, 5 analyses/minute

### MalwareBazaar
- No API key required
- Completely free for hash lookups

## 📖 Usage Guide

### AI Chat Interfaces

1. **Enter your Anthropic API key** at the top and click "Save"
2. **Navigate to desired module** using the sidebar
3. **Start chatting** with the AI specialist
4. **Use quick chips** for common queries
5. **Ask questions** in the input field

### Malware File Analysis

1. **Go to "File Analysis"** in the navigation
2. **Upload a file** by dragging and dropping or clicking to browse
3. **Select analysis platforms** (one or more)
4. **Click "Analyze File"** to start analysis
5. **View results** as they appear progressively
6. **Access full reports** via provided links

## 🎨 Features by Module

### General Terminal
- Linux hardening guides
- MITRE ATT&CK techniques
- Sigma rule creation
- Incident response procedures
- Zero Trust Architecture
- AWS IAM security
- Static malware analysis
- YARA rule development

### RedTeam Operations
- Penetration testing methodology
- Exploit development techniques
- Attack chain explanations
- Privilege escalation methods
- Active Directory enumeration
- Lateral movement techniques
- Network pivoting tools
- Permission exploitation

### BlueTeam Defense
- SIEM detection rules
- Incident response playbooks
- Threat hunting techniques
- MITRE ATT&CK defense
- Sigma rule tuning
- Ransomware IOCs

### Web Analysis
- OWASP Top 10 vulnerabilities
- SQL injection testing
- XSS vulnerability detection
- Burp Suite usage
- API security testing
- Web fuzzing with wfuzz

### Malware Analysis
- Static analysis techniques
- Dynamic analysis tools
- YARA rule creation
- Reverse engineering processes
- Malware obfuscation
- Sandbox setup

### File Analysis
- Multi-platform virus scanning
- Sandbox behavior analysis
- Malware database lookup
- Threat intelligence correlation
- MITRE ATT&CK mapping

## 🔒 Security Features

- **Client-Side Hashing** - Files hashed locally before upload
- **No File Logging** - File contents never logged to console
- **Secure Storage** - API keys stored in localStorage only
- **Privacy Warnings** - Clear warnings about sensitive data
- **HTTPS APIs** - All API calls use secure endpoints
- **Input Validation** - File size limits and type checking

## ⚠️ Security Considerations

### For Users
- **Never upload files containing:** Personal data, credentials, sensitive documents
- **Only analyze files** you have legal authorization to examine
- **Keep API keys secure** - don't share them
- **Monitor usage** - stay within API rate limits

### For Developers
- **No hardcoded credentials** - All keys stored securely
- **Input validation** - All user inputs validated
- **HTTPS only** - All external API calls use HTTPS
- **Privacy by design** - Minimal data collection
- **Rate limiting** - Respect API provider limits

## 🌐 Browser Compatibility

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

**Required Features:**
- Web Crypto API (for SHA256 hashing)
- Fetch API (for API calls)
- ES6+ JavaScript support
- CSS Grid and Flexbox support

## 🎯 Use Cases

### Security Professionals
- Rapid threat intelligence queries
- Malware sample analysis
- Security research assistance
- Detection rule creation
- Incident response support

### Penetration Testers
- Attack methodology planning
- Exploit research guidance
- Privilege escalation techniques
- Lateral movement strategies
- Report generation assistance

### Blue Teams
- Detection engineering
- Threat hunting guidance
- Incident response procedures
- Security monitoring optimization
- Threat intelligence analysis

### Students & Learners
- Security concept explanations
- Practical technique demonstrations
- Tool usage guidance
- Best practice recommendations
- Career development insights

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **Components** - Add to `src/components/`
2. **Pages** - Add to `src/pages/` and update routes in `App.tsx`
3. **Types** - Add to `src/types/`
4. **Utilities** - Add to `src/utils/`

## 🤝 Contributing

This is an educational project for legitimate security research. Contributions are welcome from security professionals, researchers, and students.

## 📄 License

This project is provided as-is for educational and legitimate security research purposes.

## ⚖️ Legal Notice

**IMPORTANT:** This tool is intended for:
- Authorized security testing
- Educational purposes
- Security research
- Incident response
- Defensive security operations

**Users must:**
- Only analyze files they have legal authorization to examine
- Comply with all applicable laws and regulations
- Obtain proper authorization before testing
- Use results responsibly and ethically

**Developers are not responsible for:**
- Misuse of this tool
- Unauthorized security testing
- Any illegal activities conducted using this tool

---

**Made with ❤️ for the Security Community**

*For authorized security testing and educational purposes only*
