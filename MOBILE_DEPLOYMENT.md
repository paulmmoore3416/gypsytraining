<div align="center">

# 📱 Gypsy Training - Mobile App Deployment Guide

![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

### Complete Guide for Backend + Android APK Deployment

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Prerequisites](#-prerequisites)
3. [Backend Setup](#-backend-setup)
4. [Mobile App Setup](#-mobile-app-setup)
5. [Building the APK](#-building-the-apk)
6. [Installing on Pixel 10 Pro](#-installing-on-pixel-10-pro)
7. [Syncing Data](#-syncing-data)
8. [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

This deployment creates a complete mobile solution for Gypsy's Training Journey:

- **Backend API**: Node.js/Express server with SQLite database
- **Android App**: React Native (Expo) app optimized for Google Pixel 10 Pro
- **Data Sync**: Bi-directional sync between web app and mobile app
- **Offline Support**: Mobile app works offline and syncs when connected

**Architecture:**
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Web Browser   │◄───────►│   Backend API   │◄───────►│  Android App    │
│ (LocalStorage)  │  Sync   │    (SQLite)     │  Sync   │  (AsyncStorage) │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## ✅ Prerequisites

### Software Requirements

1. **Node.js** (v18+) - ✓ Already installed (v20.19.4)
2. **Java JDK** (v11+) - ✓ Already installed (v17.0.17)
3. **Android Studio** or **Expo Go App**
4. **EAS CLI** (Expo Application Services)

### Install EAS CLI

```bash
npm install -g eas-cli
```

### Create Expo Account (Free)

1. Go to https://expo.dev/signup
2. Sign up with your email
3. Verify your email
4. Login via CLI:

```bash
eas login
```

---

## 🖥️ Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd /home/paul/Documents/gypsytraining/gypsytraining/backend
```

### Step 2: Dependencies Already Installed ✓

The backend dependencies have been installed. If you need to reinstall:

```bash
npm install
```

### Step 3: Configure Environment

The `.env` file is already configured with default settings:

- **Port**: 3000
- **Username**: paul
- **Password**: GypsyTraining2024!

**IMPORTANT**: Change the password in production!

```bash
nano .env
# Edit DEFAULT_PASSWORD to your secure password
```

### Step 4: Get Your Computer's Local IP Address

On your Linux machine:

```bash
hostname -I | awk '{print $1}'
```

Example output: `192.168.1.100`

**Save this IP address** - you'll need it for the mobile app!

### Step 5: Start the Backend Server

```bash
npm start
```

You should see:

```
═══════════════════════════════════════════════════════════
  🐕 Gypsy's Training Journey - API Server
═══════════════════════════════════════════════════════════
  Server running on port 3000
  Environment: development
  Health check: http://localhost:3000/health
  API docs: http://localhost:3000/api
═══════════════════════════════════════════════════════════
```

### Step 6: Test the Backend

Open another terminal and test:

```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-31T...",
  "service": "Gypsy Training API",
  "version": "1.0.0"
}
```

### Step 7: Keep Backend Running

Keep this terminal open with the backend running. For production, use a process manager like PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
pm2 start server.js --name gypsy-api

# View logs
pm2 logs gypsy-api

# Stop
pm2 stop gypsy-api
```

---

## 📱 Mobile App Setup

### Step 1: Navigate to Mobile App Directory

```bash
cd /home/paul/Documents/gypsytraining/gypsytraining/android-app
```

### Step 2: Install Dependencies

```bash
npm install
```

This will take a few minutes to install all React Native and Expo dependencies.

### Step 3: Configure API URL

Edit the API configuration file to point to your backend:

```bash
nano src/services/api.js
```

Change this line:

```javascript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3000/api';
```

To your computer's IP (from Step 4 of Backend Setup):

```javascript
const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

**Note**: Your phone must be on the same WiFi network as your computer!

### Step 4: Initialize EAS

```bash
eas init
```

Follow the prompts to create a new project.

### Step 5: Configure EAS Build

```bash
eas build:configure
```

Select:
- Platform: **Android**
- Build profile: **Preview (APK)**

---

## 🔨 Building the APK

### Method 1: Cloud Build with EAS (Recommended)

This builds the APK in the cloud - no local Android SDK needed!

```bash
eas build -p android --profile preview
```

Steps:
1. EAS will ask if you want to generate a new Android keystore - select **Yes**
2. Build will start in the cloud
3. You'll get a link to track progress: https://expo.dev/accounts/[your-account]/projects/gypsy-training-mobile/builds/[build-id]
4. When complete (~10-15 minutes), download the APK from the build page

### Method 2: Local Build

If you have Android Studio installed:

```bash
npx expo prebuild
cd android
./gradlew assembleRelease
```

APK will be in: `android/app/build/outputs/apk/release/`

### Method 3: Development Build (Testing)

For quick testing without building APK:

```bash
npm start
```

Then:
1. Install **Expo Go** app on your Pixel 10 Pro from Google Play Store
2. Scan the QR code shown in terminal
3. App will load in Expo Go

---

## 📲 Installing on Pixel 10 Pro

### Enable Developer Mode

1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times
3. Go back to **Settings** → **System** → **Developer Options**
4. Enable **USB Debugging**
5. Enable **Install Unknown Apps** for your file manager

### Transfer APK to Phone

**Option A: USB Transfer**

```bash
# Connect phone via USB
adb install path/to/app.apk
```

**Option B: Download on Phone**

1. Upload APK to Google Drive, Dropbox, or your GitHub repository
2. Download on your phone
3. Open the APK file
4. Tap "Install"

**Option C: Direct WiFi Transfer**

```bash
# From your computer
python3 -m http.server 8000

# On phone browser, go to:
http://YOUR_COMPUTER_IP:8000

# Click the APK file to download
```

### Install the APK

1. Open the downloaded APK file
2. Android will warn about installing from unknown sources - tap **Install Anyway**
3. Wait for installation to complete
4. Tap **Open** to launch the app

---

## 🔄 Syncing Data

### Initial Setup

1. **Make sure backend is running** on your computer
2. **Connect phone to same WiFi** as your computer
3. **Open the app** on your phone
4. **Login** with:
   - Username: `paul`
   - Password: `GypsyTraining2024!` (or whatever you set in .env)

### Sync Process

**From Web to Mobile:**

1. Add/edit data in web browser (journal, training, photos, etc.)
2. Web data is stored in browser LocalStorage
3. Open mobile app
4. On Home screen, **pull down** to refresh (or tap "Sync Now")
5. App will fetch all data from backend
6. Data is now available on mobile (works offline after sync)

**From Mobile to Web:**

1. Add/edit data in mobile app
2. Pull down to sync
3. Mobile data is sent to backend API
4. Open web app
5. Implement sync functionality in web app (see Web Integration section)

### Sync Indicators

- **Green cloud icon**: Data is synced
- **Spinning sync icon**: Currently syncing
- **Last synced time**: Shows when last sync occurred
- **Pull to refresh**: Manually trigger sync

### Offline Mode

- Mobile app stores all data locally in AsyncStorage
- Works completely offline after initial sync
- Changes are queued and synced when connection is restored

---

## 🌐 Web App Integration

To enable sync in your web app, add this to `index.html`:

```html
<script>
// Add sync button to your web interface
async function syncToBackend() {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Login first
    const response = await fetch('http://192.168.1.100:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'paul',
        password: 'GypsyTraining2024!'
      })
    });

    const data = await response.json();
    localStorage.setItem('authToken', data.token);
  }

  // Sync training data
  const trainingSessions = JSON.parse(localStorage.getItem('gypsy_training') || '{}');
  const journalEntries = JSON.parse(localStorage.getItem('gypsy_journal') || '[]');

  await fetch('http://192.168.1.100:3000/api/training/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({
      sessions: trainingSessions.sessions || [],
      progress: trainingSessions.progress || []
    })
  });

  // Sync journal
  for (const entry of journalEntries) {
    await fetch('http://192.168.1.100:3000/api/journal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(entry)
    });
  }

  alert('Synced successfully!');
}
</script>

<!-- Add sync button to your interface -->
<button onclick="syncToBackend()">Sync to Mobile</button>
```

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: `Error: Cannot find module 'express'`
```bash
cd backend
npm install
```

**Problem**: Port 3000 already in use
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env file
PORT=3001
```

**Problem**: Database errors
```bash
# Delete and recreate database
rm -rf backend/data/gypsy-training.db
npm start
```

### Mobile App Issues

**Problem**: Cannot connect to backend

1. Check backend is running: `curl http://localhost:3000/health`
2. Check phone is on same WiFi
3. Check firewall isn't blocking port 3000:
   ```bash
   sudo ufw allow 3000
   ```
4. Verify IP address in `src/services/api.js` is correct

**Problem**: App crashes on launch

1. Check logs: `npx expo start`
2. Clear cache: `npx expo start -c`
3. Reinstall dependencies:
   ```bash
   rm -rf node_modules
   npm install
   ```

**Problem**: Build fails

1. Check EAS account is logged in: `eas whoami`
2. Check internet connection
3. Try again - cloud builds can be flaky

### Sync Issues

**Problem**: Data not syncing

1. Check network connection
2. Check backend is accessible from phone browser: `http://YOUR_IP:3000/health`
3. Check login credentials
4. Clear app data and re-login

**Problem**: Duplicate data after sync

This is expected if you modify same data on both web and mobile. Last write wins.

---

## 🚀 Production Deployment

### For Long-Term Use

**1. Deploy Backend to Cloud**

Use a service like:
- **Heroku** (free tier available)
- **Railway.app** (free tier)
- **DigitalOcean** ($5/month)
- **AWS EC2** (free tier)

Then update `API_BASE_URL` in mobile app to your cloud URL.

**2. Use HTTPS**

Get a free SSL certificate from Let's Encrypt for secure connections.

**3. Use Environment Variables**

Store API URL in app configuration:

```javascript
const API_URL = __DEV__
  ? 'http://192.168.1.100:3000/api'  // Development
  : 'https://your-domain.com/api';   // Production
```

**4. Build Production APK**

```bash
eas build -p android --profile production
```

---

## 📊 Features Summary

### ✅ Completed Features

- ✓ Backend API with SQLite database
- ✓ JWT authentication
- ✓ Training session tracking
- ✓ Journal entries
- ✓ Photo albums
- ✓ Nutrition logging
- ✓ Full and incremental sync
- ✓ Mobile app with offline support
- ✓ Beautiful UI matching web design
- ✓ Optimized for Pixel 10 Pro

### 🔄 Usage Workflow

1. **At Desk**: Use web app for detailed work
2. **On Mobile**: Quick logging and viewing
3. **Sync**: Pull to refresh on mobile app
4. **Offline**: Mobile app works without internet
5. **Sync Back**: Automatic sync when online

---

## 📞 Support

**Login Credentials:**
- Username: `paul`
- Password: `GypsyTraining2024!`

**Backend Health Check:**
- http://YOUR_IP:3000/health

**API Documentation:**
- http://YOUR_IP:3000/api

---

## 🎖️ Built for Veterans

**Semper Fidelis** 🇺🇸

This system is designed to support your journey with Gypsy. All data stays private and under your control.

---

**Version**: 1.0.0
**Last Updated**: December 2024
**Platform**: Android 10+ (Optimized for Pixel 10 Pro)

