# 🔐 CyberSec AI Terminal

A comprehensive cybersecurity platform featuring AI-powered chat interfaces for specialized security domains and malware file analysis capabilities.

## 🌟 Features

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

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- Internet connection for API calls

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cybersec-site
   ```

2. **Open in browser**
   - Simply open `cybersec-ai.html` in your web browser
   - Or use a local server:
     ```bash
     python -m http.server 8000
     # Then visit http://localhost:8000/cybersec-ai.html
     ```

3. **Configure API keys** (optional but recommended)
   - Click the lock icon or configure when prompted
   - Enter your Anthropic API key for chat features
   - Enter VirusTotal/Hybrid Analysis keys for file analysis

## 📖 Usage Guide

### AI Chat Interfaces

1. **Navigate to desired module** using the sidebar
2. **Enter your Anthropic API key** and click "Save"
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

## 🔑 API Keys Setup

### Anthropic API (Chat Features)

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Enter in the app's API key field

**Free Tier:** Varies by usage model

### VirusTotal API (File Analysis)

1. Visit [VirusTotal](https://www.virustotal.com/)
2. Sign up for a free account
3. Go to [API Key Settings](https://www.virustotal.com/gui/my-api-key)
4. Copy your API key
5. Enter in the app when prompted

**Free Tier:** 500 requests/day, 4 requests/minute

### Hybrid Analysis API (File Analysis)

1. Visit [CrowdStrike Hybrid Analysis](https://www.hybrid-analysis.com/)
2. Sign up for a free account
3. Go to [API Settings](https://www.hybrid-analysis.com/profile/api)
4. Copy your API key
5. Enter in the app when prompted

**Free Tier:** 25 analyses/day, 5 analyses/minute

### MalwareBazaar
- No API key required
- Completely free for hash lookups

## 📁 Project Structure

```
cybersec-site/
├── cybersec-ai.html              # Main terminal chat interface
├── cybersec-ai.css                # Shared styling
├── cybersec-ai.js                 # Main terminal functionality
├── redteam.html                   # RedTeam operations chat
├── redteam.js                     # RedTeam functionality
├── blueteam.html                 # BlueTeam defense chat
├── blueteam.js                   # BlueTeam functionality
├── web-analysis.html              # Web analysis chat
├── web-analysis.js                # Web analysis functionality
├── malware-analysis.html           # Malware analysis chat
├── malware-analysis.js            # Malware analysis functionality
├── malware-upload.html            # File analysis interface
├── malware-upload.css             # File analysis styling
├── malware-upload.js              # File analysis functionality
├── MALWARE_ANALYSIS_README.md    # Detailed file analysis docs
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

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

## 🛡️ Security Features

- **Client-Side Hashing** - Files hashed locally before upload
- **No File Logging** - File contents never logged to console
- **Secure Storage** - API keys stored in localStorage only
- **Privacy Warnings** - Clear warnings about sensitive data
- **HTTPS APIs** - All API calls use secure endpoints
- **Input Validation** - File size limits and type checking

## 🔒 Security Considerations

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

## 📚 Additional Resources

### Documentation
- [Malware Analysis Feature Docs](MALWARE_ANALYSIS_README.md)
- [Environment Variables](.env.example)

### API Documentation
- [Anthropic API](https://docs.anthropic.com/)
- [VirusTotal API](https://www.virustotal.com/docs/)
- [Hybrid Analysis API](https://www.hybrid-analysis.com/docs/)
- [MalwareBazaar API](https://bazaar.abuse.ch/api/)

### Learning Resources
- [MITRE ATT&CK](https://attack.mitre.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Maintain consistent coding style
- Add comments for complex logic
- Update documentation for new features
- Test across different browsers
- Respect security best practices

## 🐛 Troubleshooting

### Chat Features Not Working
- **Issue:** "API error" messages
- **Solution:** Verify your Anthropic API key is valid and not expired

### File Analysis Not Working
- **Issue:** Platform returns errors
- **Solution:** Check API keys are configured correctly and you haven't exceeded rate limits

### Hash Computation Failed
- **Issue:** "Error computing hash"
- **Solution:** Ensure you're using a modern browser with Web Crypto API support

### Platform Not Available
- **Issue:** Some platforms disabled
- **Solution:** URLhaus is only for URLs/domains, not file uploads

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

## 🔗 Links

- **Project Repository:** [GitHub URL]
- **Issue Tracker:** [Issues URL]
- **Documentation:** [Wiki URL]
- **Discussion:** [Discussions URL]

## 🙏 Acknowledgments

- **Anthropic** - Claude API for AI capabilities
- **VirusTotal** - Multi-engine virus scanning
- **CrowdStrike** - Hybrid Analysis sandbox
- **Abuse.ch** - MalwareBazaar and URLhaus databases
- **Security Community** - Ongoing feedback and support

---

**Made with ❤️ for the Security Community**

*For authorized security testing and educational purposes only*