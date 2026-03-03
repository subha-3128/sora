# Daily Life Management & Study Progress Tracking System

A lean MVP (Minimum Viable Product) for personal academic improvement and daily life management - **works on all your devices from anywhere in the world!**

## ✨ Features

- 📋 **Daily Tasks** - Track daily tasks and to-dos
- 📚 **Study Sessions** - Log study sessions with subject tracking
- 📊 **Progress Tracking** - Monitor subject-wise and overall progress
- 🔁 **Habit Tracking** - Build and track daily habits
- 📈 **Weekly Reviews** - Reflect on weekly performance
- 🎯 **Monthly Insights** - Track long-term progress and patterns

## 🚀 Multi-Device Support with Cloud Database

✅ **Works everywhere**: Phone, Tablet, Desktop, Laptop
✅ **Installable**: Add as app on iOS, Android, Windows, Mac, Linux  
✅ **Cloud Database**: Access your data from anywhere in the world
✅ **Offline**: Works without internet connection
✅ **Real-time Sync**: Changes sync across all devices instantly
✅ **Responsive**: Perfect on any screen size

### 📍 Access From Anywhere (Recommended)

No local WiFi needed! Deploy to the cloud and access from any device, anywhere:

1. **Deploy to Cloud** (2 minutes setup) - [Quick Guide](docs/CLOUD_DEPLOYMENT.md)
2. **Get a public URL** - Instantly accessible worldwide
3. **Cloud Database** - Data stored safely and synced in real-time
4. **Install as app** - Add to home screen on iOS, Android, Windows, Mac

**Platforms**: Railway (easiest) • Vercel • Supabase • Render • AWS

## 💻 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (production) + SQLite (local development)
- **UI**: Radix UI components with Tailwind CSS
- **PWA**: Service Workers for offline support & installability

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and helpers
│   └── index.html
├── server/              # Express backend
│   ├── routes/          # API route handlers
│   ├── db.ts            # Database configuration
│   └── index.ts         # Server entry point
├── shared/              # Shared types and schemas
├── docs/                # Documentation
└── script/              # Build scripts
```

## Getting Started

### Option 1: Local Development (Same WiFi)

```bash
npm install
npm run dev
```

Starts on `http://localhost:5000`

Access from other devices on same network:
- Find your IP: `ifconfig getifaddr en0` (macOS)
- Visit: `http://your-ip:5000` on other devices

### Option 2: Cloud Deployment (Access from Anywhere) - Recommended

Deploy to a cloud platform and access from any device, anywhere:

```bash
# See detailed setup guide
cat docs/CLOUD_DEPLOYMENT.md
```

**Quick setup with Railway (2 min):**
1. Push code to GitHub: `git push origin main`
2. Go to https://railway.app
3. Connect GitHub repo and deploy
4. Get your live URL
5. Share with any device!

See [Cloud Deployment Guide](docs/CLOUD_DEPLOYMENT.md) for Railway, Vercel, Supabase, and more.

### Other Commands

```bash
npm run build              # Build for production
npm run check              # Type check
npm run db:push            # Push database schema
npm run db:studio          # Open database UI
npm run deploy:check       # Check deployment readiness
```

## 📚 Documentation

- ☁️ [Cloud Deployment](docs/CLOUD_DEPLOYMENT.md) - **Deploy to access from anywhere**
- 🏠 [Local WiFi Setup](docs/MULTI_DEVICE_SETUP.md) - For same-network devices
- 📋 [MVP Requirements](docs/MVP_REQUIREMENTS.md) - Design philosophy
- 🚀 [Advanced Deployment](docs/DEPLOYMENT.md) - More production options
