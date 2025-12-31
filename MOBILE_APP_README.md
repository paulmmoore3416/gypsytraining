<div align="center">

# 📱 Gypsy Training - Mobile Application

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

### Complete Mobile + Backend Solution for Service Dog Training Documentation

**Optimized for Google Pixel 10 Pro**

</div>

---

## 📦 What's Included

This project now includes a complete mobile solution:

### Backend API (`/backend`)

- ✅ Node.js/Express REST API
- ✅ SQLite database for data persistence
- ✅ JWT authentication
- ✅ Full sync endpoints for all data types
- ✅ CORS configured for web/mobile access
- ✅ Rate limiting and security middleware

### Android App (`/android-app`)

- ✅ React Native (Expo) mobile application
- ✅ Offline-first architecture with AsyncStorage
- ✅ Beautiful UI matching web design theme
- ✅ Bi-directional sync with backend
- ✅ Photo capture and upload
- ✅ Optimized for Pixel 10 Pro display

### Features

| Feature | Web App | Mobile App | Backend API |
|---------|---------|------------|-------------|
| Training Sessions | ✅ | ✅ | ✅ |
| Journal Entries | ✅ | ✅ | ✅ |
| Photo Albums | ✅ | ✅ | ✅ |
| Nutrition Logs | ✅ | ✅ | ✅ |
| Progress Tracking | ✅ | ✅ | ✅ |
| Offline Support | ✅ (LocalStorage) | ✅ (AsyncStorage) | N/A |
| Data Sync | Manual | Pull-to-Refresh | Automatic |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     YOUR TRAINING WORKFLOW                        │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Web Browser   │◄───────►│   Backend API   │◄───────►│  Android App    │
│                 │  HTTP   │                 │  HTTP   │                 │
│  (At Desk)      │  Sync   │  (Your PC)      │  Sync   │  (Mobile)       │
│                 │         │                 │         │                 │
│  LocalStorage   │         │  SQLite DB      │         │  AsyncStorage   │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘

        │                           │                           │
        │                           │                           │
        ▼                           ▼                           ▼

  ┌─────────────┐           ┌─────────────┐           ┌─────────────┐
  │  Training   │           │  Persistent │           │   Offline   │
  │   Photos    │           │    Sync     │           │   Access    │
  │  Journal    │           │   Storage   │           │   On-the-Go │
  │  Nutrition  │           │   Backup    │           │   Quick Log │
  └─────────────┘           └─────────────┘           └─────────────┘
```

---

## 📂 Project Structure

```
gypsytraining/
├── backend/                        # Node.js Backend API
│   ├── server.js                   # Main server file
│   ├── package.json                # Backend dependencies
│   ├── .env                        # Environment configuration
│   ├── database/
│   │   └── init.js                 # Database initialization
│   ├── routes/
│   │   ├── auth.js                 # Authentication endpoints
│   │   ├── training.js             # Training session endpoints
│   │   ├── journal.js              # Journal endpoints
│   │   ├── photos.js               # Photo endpoints
│   │   ├── nutrition.js            # Nutrition endpoints
│   │   └── sync.js                 # Sync endpoints
│   ├── middleware/
│   │   └── auth.js                 # JWT auth middleware
│   └── data/
│       └── gypsy-training.db       # SQLite database (auto-created)
│
├── android-app/                    # React Native Mobile App
│   ├── App.js                      # Main app component
│   ├── app.json                    # Expo configuration
│   ├── package.json                # Mobile dependencies
│   ├── src/
│   │   ├── screens/
│   │   │   ├── LoginScreen.js      # Authentication
│   │   │   ├── HomeScreen.js       # Dashboard with sync
│   │   │   ├── TrainingScreen.js   # Training module
│   │   │   ├── JournalScreen.js    # Journal module
│   │   │   ├── PhotosScreen.js     # Photos module
│   │   │   ├── NutritionScreen.js  # Nutrition module
│   │   │   └── ResourcesScreen.js  # Resources module
│   │   ├── context/
│   │   │   ├── AuthContext.js      # Authentication state
│   │   │   └── SyncContext.js      # Sync state management
│   │   └── services/
│   │       └── api.js              # API client
│   └── assets/                     # App icons and images
│
├── index.html                      # Web application
├── css/                            # Web styles
├── js/                             # Web JavaScript
├── README.md                       # Main documentation
├── MOBILE_DEPLOYMENT.md            # Detailed deployment guide
├── QUICK_START_MOBILE.md           # Quick setup guide
└── MOBILE_APP_README.md            # This file
```

---

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd /path/to/gypsytraining/backend
npm install  # First time only
npm start
```

### 2. Build Mobile App

```bash
cd /path/to/gypsytraining/android-app
npm install  # First time only

# Edit API URL in src/services/api.js
# Change to your computer's IP address

# Build APK (requires Expo account)
eas build -p android --profile preview
```

### 3. Install on Phone

1. Download APK from build
2. Transfer to Pixel 10 Pro
3. Install and open
4. Login with credentials from `.env` file

### 4. Sync Data

Pull down on Home screen to sync between web and mobile.

---

## 🔄 Sync Workflow

### Initial Sync

1. **Web → Backend**: Export data from web LocalStorage, send to API
2. **Backend → Mobile**: Mobile app pulls all data on first sync
3. **Mobile → Backend**: Mobile changes pushed on sync
4. **Backend → Web**: Web app pulls latest data

### Ongoing Sync

- **Mobile**: Pull-to-refresh on Home screen
- **Web**: Add sync button (see MOBILE_DEPLOYMENT.md)
- **Automatic**: Background sync when app opens (future enhancement)

### Conflict Resolution

- **Last Write Wins**: Most recent update takes precedence
- **Offline Changes**: Queued and synced when online
- **Deleted Items**: Soft delete with `deleted` flag

---

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

Test endpoints:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api
```

### Mobile Development

```bash
cd android-app
npm start
```

- Scan QR code with Expo Go app for live testing
- Changes auto-reload on save
- Press `r` in terminal to reload
- Press `m` to open developer menu

### Database Management

View database:
```bash
cd backend/data
sqlite3 gypsy-training.db
.tables
SELECT * FROM users;
.exit
```

Reset database:
```bash
rm backend/data/gypsy-training.db
npm start  # Will recreate
```

---

## 📱 Mobile App Features

### Home Screen

- Dashboard with stats
- Sync status indicator
- Last sync timestamp
- Pull-to-refresh sync
- Quick action buttons

### Training Screen

- View training sessions
- Log new sessions
- Track progress by phase
- Rate performance

### Journal Screen

- Create entries
- View past entries
- Categorize by mood
- Word count tracking

### Photos Screen

- Create albums
- Upload photos
- View gallery
- Organize by date

### Nutrition Screen

- Log meals
- Track calories/protein
- View history
- Daily summaries

### Resources Screen

- Veteran resources
- Training commands
- Vet clinic info
- Emergency contacts

---

## 🔒 Security

### Authentication

- JWT tokens (30-day expiration)
- Bcrypt password hashing (10 rounds)
- Secure token storage (AsyncStorage/SecureStore)

### API Security

- CORS enabled for trusted origins
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- Input validation

### Data Privacy

- All data stored locally (SQLite)
- No cloud storage
- No analytics/tracking
- Complete data ownership

---

## 🌐 Network Configuration

### Development (Same WiFi)

```javascript
// android-app/src/services/api.js
const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

### Production (Cloud Backend)

Deploy backend to:
- Heroku (free)
- Railway.app (free)
- DigitalOcean ($5/mo)
- AWS EC2 (free tier)

Then update API URL:
```javascript
const API_BASE_URL = 'https://your-domain.com/api';
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Training
- `GET /api/training/sessions` - Get all sessions
- `POST /api/training/sessions` - Create session
- `GET /api/training/progress` - Get progress
- `POST /api/training/progress` - Update progress
- `POST /api/training/sync` - Batch sync

### Journal
- `GET /api/journal` - Get entries
- `POST /api/journal` - Create/update entry

### Photos
- `GET /api/photos/albums` - Get albums
- `GET /api/photos/album/:id` - Get photos
- `POST /api/photos/album` - Create album
- `POST /api/photos/photo` - Upload photo

### Nutrition
- `GET /api/nutrition` - Get logs
- `POST /api/nutrition` - Create log

### Sync
- `GET /api/sync/full` - Full sync (all data)
- `GET /api/sync/incremental?since=ISO_DATE` - Incremental sync
- `POST /api/sync/metadata` - Record sync event

---

## 🎨 Design System

### Colors (Pacific Northwest Theme)

- **Primary Green**: `#1a3a2e`, `#2d5a4a`
- **Sky Blue**: `#4a7c9e`
- **Autumn Orange**: `#d97642`
- **Misty Gray**: `#b8cdc7`, `#e8f1ef`

### Typography

- **Headers**: Bold, 20-24px
- **Body**: Regular, 14-16px
- **Captions**: 12-14px

### Components

- Rounded corners (10px)
- Shadow elevation for cards
- Pacific NW mountain theme
- Warm, supportive colors

---

## 🔧 Troubleshooting

### Backend Won't Start

```bash
# Check port 3000 is free
lsof -ti:3000 | xargs kill -9

# Check dependencies
cd backend && npm install

# Check database
ls -la data/
```

### Mobile App Won't Connect

1. Check backend is running
2. Verify phone on same WiFi
3. Check IP in `src/services/api.js`
4. Test: `curl http://YOUR_IP:3000/health`
5. Allow port in firewall: `sudo ufw allow 3000`

### Sync Not Working

1. Check login credentials
2. Check network connection
3. View console logs in backend
4. Clear app data and re-login

---

## 📖 Documentation

- **[MOBILE_DEPLOYMENT.md](MOBILE_DEPLOYMENT.md)** - Complete deployment guide
- **[QUICK_START_MOBILE.md](QUICK_START_MOBILE.md)** - 5-minute quick start
- **[README.md](README.md)** - Main project documentation

---

## 🎯 Future Enhancements

- [ ] Push notifications for reminders
- [ ] Automatic background sync
- [ ] Photo compression before upload
- [ ] Export data to PDF
- [ ] Training calendar view
- [ ] Charts and analytics
- [ ] Voice notes
- [ ] Wear OS integration

---

## 🙏 Credits

**Built for Paul Moore & Gypsy**

- U.S. Marine Corps Veteran
- 90% Service-Connected Disability
- PTSD Support Journey
- Blue Nose APBT Service Dog Training

**Technology Stack:**
- React Native (Expo)
- Node.js & Express
- SQLite
- JWT Authentication
- AsyncStorage

---

## 📞 Support

**Default Login:**
- Username: `paul`
- Password: `GypsyTraining2024!`

**Backend Health:**
- http://YOUR_IP:3000/health

**Need Help?**
- See [MOBILE_DEPLOYMENT.md](MOBILE_DEPLOYMENT.md) for detailed troubleshooting
- Check backend logs: `cd backend && npm start`
- Check mobile logs in Expo Go or `npx expo start`

---

<div align="center">

**🎖️ Semper Fidelis 🇺🇸**

*Built with dedication for Gypsy's training journey and personal healing.*

![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Android_10+-green?style=flat-square)
![Device](https://img.shields.io/badge/Optimized-Pixel_10_Pro-orange?style=flat-square)

</div>
