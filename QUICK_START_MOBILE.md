# 🚀 Quick Start Guide - Mobile App

## 5-Minute Setup

### 1. Start the Backend (On Your Computer)

```bash
cd /home/paul/Documents/gypsytraining/gypsytraining/backend
npm start
```

### 2. Get Your Computer's IP Address

```bash
hostname -I | awk '{print $1}'
```

Example: `192.168.1.100` - **Write this down!**

### 3. Setup Mobile App

```bash
cd /home/paul/Documents/gypsytraining/gypsytraining/android-app

# Install dependencies (first time only)
npm install

# Edit API URL
nano src/services/api.js
# Change: const API_BASE_URL = 'http://192.168.1.100:3000/api';
#         (use YOUR IP from step 2)
```

### 4. Build APK

**Option A: Cloud Build (Easiest)**

```bash
# Install EAS CLI (first time only)
npm install -g eas-cli

# Login to Expo (first time only)
eas login

# Build APK
eas build -p android --profile preview
```

Wait ~10 minutes, then download APK from the link provided.

**Option B: Quick Test (No APK)**

```bash
npm start
```

Install "Expo Go" app on your phone, scan the QR code.

### 5. Install on Phone

1. Transfer APK to phone (USB, email, Drive, etc.)
2. Enable "Install from Unknown Sources"
3. Open APK file and install
4. Open app and login:
   - Username: `paul`
   - Password: `GypsyTraining2024!`

### 6. Sync Data

- Pull down on Home screen to sync
- Data from web app will appear on mobile
- Works offline after initial sync

## ✅ You're Done!

**At Your Desk**: Use web app
**On the Go**: Use mobile app
**Sync**: Pull to refresh on mobile

---

For detailed instructions, see [MOBILE_DEPLOYMENT.md](MOBILE_DEPLOYMENT.md)
