# 🤖 YouTube OCR Verification Bot

<div align="center">
  
  **An intelligent Discord bot that verifies YouTube subscriptions using advanced OCR technology**
  
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Discord.js](https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![Tesseract](https://img.shields.io/badge/Tesseract-OCR-blue?style=for-the-badge)

  ![GitHub stars](https://img.shields.io/github/stars/tejvz/chequez?style=social)
  ![GitHub forks](https://img.shields.io/github/forks/tejvz/chequez?style=social)
  ![GitHub issues](https://img.shields.io/github/issues/tejvz/chequez)
  ![GitHub license](https://img.shields.io/github/license/tejvz/chequez)
  ![GitHub last commit](https://img.shields.io/github/last-commit/tejvz/chequez)
  
</div>

---

## ⚠️ Important Notice

> **📋 PLEASE READ THE LICENSE BEFORE USING THIS BOT**
> 
> This bot is distributed under a custom license. Make sure you understand the terms and conditions before installation and usage.
> 
> **License Location:** `Licence/LICENSE.md`

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 16.0.0 or higher
- **npm** 7.0.0 or higher  
- **Discord Bot Token** from [Discord Developer Portal](https://discord.com/developers/applications)
- Basic knowledge of Discord bot setup

### 📦 Installation

1. **Clone & Navigate**
   ```bash
   git clone https://github.com/tejvz/chequez.git
   cd chequez
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Replace Your Details In cheques.js
   nano cheques.js
   ```

4. **Launch the Bot**
   ```bash
   npm run dev
   npm start
   npm run pm2:start
   ```

---

## 🎯 Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 🔍 **Advanced OCR** | Powered by Tesseract.js for accurate text recognition |
| ⚡ **Lightning Fast** | Quick verification responses under 10-15 seconds |
| 🛡️ **Privacy Focused** | Images processed locally and deleted immediately |
| 🎨 **User Friendly** | Intuitive commands with clear feedback messages |
| 📱 **Cross Platform** | Works seamlessly on desktop, mobile, and web |
| 🔧 **Easy Setup** | Single file architecture for simple deployment |
| 📊 **Smart Detection** | Intelligent subscription status recognition |
| 🌐 **Multi-Language** | Supports multiple OCR languages |

</div>

---

## 📖 How It Works

1. **Upload Screenshot** - Users upload a screenshot of their YouTube subscription page
2. **OCR Processing** - Bot analyzes the image using advanced text recognition
3. **Smart Verification** - Intelligently detects subscription status and channel name
4. **Instant Response** - Provides immediate feedback with verification results
5. **Role Assignment** - Automatically assigns verified subscriber roles

---

## 🔧 Configuration

### Bot Permissions Required

- Read Messages
- Send Messages  
- Embed Links
- Attach Files
- Manage Roles
- Use Slash Commands

---

## 🚀 Production Deployment

### Using PM2 (Recommended)

```bash
npm run pm2:start
npm run pm2:logs
npm run pm2:restart
npm run pm2:stop
```

### Using Docker

```bash
docker build -t cheques-bot .
docker run -d --name cheques --env-file .env cheques-bot
```

---

## 🛠️ Development

### Available Scripts

```bash
npm start
npm run dev 
npm run lint
npm run format
npm test
```

### Code Structure

```
cheques-core/
├── cheques.js           # Main bot file (all-in-one)
├── package.json         # Dependencies and scripts
├── Licence/LICENSE.md  # Custom license
└── README.md           # You are here!
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support & Community

<div align="center">

### 👑 **Creator**
**Tejv** - Lead Developer

### 🌐 **Join Our Community**
[![Discord](https://img.shields.io/badge/Join%20Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/PYfeSaDGPJ)

**💬 Need Help?** Join our Discord server for:
- Technical support
- Feature requests  
- Community discussions
- Bot updates and announcements

</div>

---

## 📊 Statistics

<div align="center">

![GitHub Repo Stats](https://github-readme-stats.vercel.app/api?username=tejvz&repo=chequez&theme=dark&show_icons=true)

</div>

---

## 🔄 Changelog

### Version 1.0.0 (Latest)
- Initial release with full OCR verification
- Discord.js v14 support
- PM2 production configuration
- Comprehensive error handling
- Multi-language OCR support

[View Full Changelog](CHANGELOG.md)

---

## 📄 License

This project is licensed under a **Custom License**. Please read the [LICENSE file](Licence/LICENSE.md) for complete terms and conditions.

**Key Points:**
- ✅ Personal use allowed
- ✅ Modification allowed
- ❌ Commercial use restricted
- ❌ Distribution without permission prohibited

---

## 📚 Acknowledgments

- **Discord.js** - Powerful Discord API wrapper
- **Tesseract.js** - Amazing OCR capabilities
- **Node.js Community** - For the awesome ecosystem
- **Contributors** - Thank you for making this project better

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

**Made with ❤️ & by [Tejv](https://youtube.com/@tejware)**

*Dont Forget To Support Us*

**Support Us – [Discord](https://discord.gg/PYfeSaDGPJ)**

*🚀 Empowering Discord communities with intelligent verification*

[![Visitors](https://visitor-badge.laobi.icu/badge?page_id=tejvz.chequez)](https://github.com/tejvz/chequez)


</div>



