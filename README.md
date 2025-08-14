# 🎓 Polytechnic Study Portal

एक complete study portal जो admin और students के लिए बनाया गया है। इसमें notes upload, quiz creation, file download और user management की सुविधा है।

## 🚀 Quick Start

### 1. Requirements
- **Node.js** (v14 या higher) - [Download करें](https://nodejs.org/)
- **Web Browser** (Chrome, Firefox, Edge)

### 2. Installation & Setup

#### Option A: Automatic Setup (Recommended)
```bash
# Simply double-click this file:
start-server.bat
```

#### Option B: Auto-Restart Server (Never stops)
```bash
# Server automatically restarts if crashed:
auto-restart-server.bat
```

#### Option C: PM2 Process Manager (Professional)
```bash
# Permanent background server:
setup-pm2.bat
```

#### Option D: Server Management Menu
```bash
# All options in one place:
server-manager.bat
```

#### Option E: Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start
```

### 3. Access Portal
- **Frontend**: http://localhost:3000
- **Login Page**: http://localhost:3000/login.html

## 👥 Login Credentials

### Primary Credentials (Recommended)
#### Admin Access
- **Username**: `admin`
- **Password**: `admin123`

#### Student Access
- **Username**: `student`
- **Password**: `student123`

### Alternative Credentials
#### Admin Access
- **Username**: `AMIT@POLY`
- **Password**: `AMIT@POLY`

#### Student Access
- **Username**: `STUDENT@POLY`
- **Password**: `POLY@1122`

## 📁 Project Structure

```
poly-study-portal/
├── server.js                    # Backend server
├── package.json                 # Dependencies
├── start-server.bat            # Quick start script
├── auto-restart-server.bat     # Auto-restart server
├── start-network-server.bat    # Network sharing
├── setup-pm2.bat              # PM2 setup
├── install-windows-service.bat # Windows service
├── deploy-to-github.bat        # GitHub deployment
├── server-manager.bat          # Management menu
├── .env                        # Environment variables
├── js/
│   ├── api.js                  # API communication
│   ├── auth.js                 # Authentication
│   ├── app.js                  # Frontend logic
│   ├── admin-backend.js        # Admin functionality
│   └── admin.js                # Legacy admin (localStorage)
├── data/
│   ├── content.js              # Static content
│   └── database.json           # Runtime database
├── uploads/
│   ├── notes/                  # Uploaded notes
│   └── question-banks/         # Uploaded question banks
├── docs/
│   ├── DEPLOYMENT-GUIDE.md     # Complete deployment guide
│   ├── SERVER-AUTO-START-GUIDE.md # Server startup solutions
│   ├── QUICK-START-GUIDE.md    # Quick troubleshooting
│   └── SYSTEM-CHECK-REPORT.md  # System verification
└── HTML files...
```

## 🔧 Features

### 👨‍💼 Admin Features
- ✅ **File Upload**: PDF notes और question banks
- ✅ **Quiz Creation**: Interactive quizzes with multiple choice questions
- ✅ **Content Management**: Real-time statistics और recent uploads
- ✅ **Delete Operations**: Topics और quizzes delete करना
- ✅ **User Management**: Admin dashboard with analytics
- ✅ **Content Filtering**: Subject-wise content organization
- ✅ **Upload Statistics**: Track all uploads and downloads

### 🎓 Student Features
- ✅ **Subject Browsing**: 6 subjects (English, Math, Chemistry, Physics, Engineering Drawing, Computer)
- ✅ **File Download**: PDF notes और question banks download
- ✅ **Interactive Quizzes**: Practice tests with instant feedback
- ✅ **Search**: Global search across topics और content
- ✅ **Resources**: All files organized by subject
- ✅ **Mobile Support**: Responsive design for all devices

## 🌐 API Endpoints

### Authentication
- `POST /api/login` - User login
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:name` - Get specific subject

### Admin Only
- `POST /api/upload` - Upload files
- `POST /api/quiz` - Create quiz
- `DELETE /api/topic` - Delete topic
- `DELETE /api/quiz/:id` - Delete quiz
- `GET /api/admin/stats` - Get statistics

### Student & Admin
- `GET /api/quiz/:id` - Get quiz
- `GET /api/quizzes` - Get all quizzes
- `GET /api/resources` - Get all resources
- `GET /uploads/*` - Download files

## 💾 Data Storage

### Development Mode
- **Database**: JSON file (`data/database.json`)
- **Files**: Local filesystem (`uploads/`)
- **Session**: JWT tokens + sessionStorage

### Production Ready
- **Database**: MongoDB (ready to integrate)
- **Files**: Cloud storage (AWS S3, etc.)
- **Authentication**: JWT with proper security

## 🔒 Security Features

- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Role-based Access**: Admin vs Student permissions
- ✅ **File Validation**: Only PDF files allowed
- ✅ **Rate Limiting**: API protection
- ✅ **CORS**: Cross-origin security
- ✅ **Helmet**: Security headers

## 🚀 Deployment Options

### 1. Local Network Sharing (Instant)
```bash
# Share on same WiFi network:
start-network-server.bat
```
- ✅ Mobile access from same WiFi
- ✅ No internet required
- ✅ Instant sharing

### 2. GitHub + Cloud Hosting (Permanent)
```bash
# Upload to GitHub and deploy:
deploy-to-github.bat
```
- ✅ Permanent online URL
- ✅ Free hosting on Vercel/Netlify
- ✅ Professional deployment

### 3. PM2 Process Manager (Background)
```bash
# Run permanently in background:
setup-pm2.bat
```
- ✅ Auto-start with Windows
- ✅ Auto-restart on crash
- ✅ Professional monitoring

### 4. Windows Service (Production)
```bash
# Install as Windows Service (Run as Admin):
install-windows-service.bat
```
- ✅ System-level service
- ✅ Runs in background
- ✅ Production-ready

### 5. Server Management Menu
```bash
# All deployment options:
server-manager.bat
```

## 🌐 Publishing Steps

### Quick Publish (5 minutes):
1. **Double-click**: `start-network-server.bat`
2. **Share IP address** with students
3. ✅ Portal is live on network!

### Permanent Publish (15 minutes):
1. **Double-click**: `deploy-to-github.bat`
2. **Create GitHub account** if needed
3. **Connect to Vercel.com**
4. ✅ Portal is live online!

### Professional Setup (30 minutes):
1. **Double-click**: `setup-pm2.bat`
2. **Configure domain** (optional)
3. **Setup SSL** (optional)
4. ✅ Production-ready portal!

## 🛠️ Development

### Start Development Server
```bash
npm run dev          # With auto-restart
# or
npm start           # Production mode
```

### Environment Variables
Edit `.env` file:
```env
PORT=3000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 📦 Dependencies

### Backend
- **Express.js**: Web framework
- **Multer**: File upload handling
- **JWT**: Authentication tokens
- **CORS**: Cross-origin requests
- **Helmet**: Security middleware

### Frontend
- **Bootstrap 5**: UI framework
- **Vanilla JavaScript**: No framework dependencies
- **Fetch API**: Backend communication

## 🔧 Troubleshooting

### Common Issues

1. **Server won't start**
   ```bash
   # Check if port 3000 is free
   netstat -ano | findstr :3000
   
   # Kill process if needed
   taskkill /PID <process_id> /F
   ```

2. **File upload fails**
   - Check file size (max 50MB)
   - Ensure PDF format
   - Verify admin login

3. **Downloads not working**
   - Check browser console for errors
   - Verify file exists in `uploads/` directory
   - Try right-click → Save as

### Development Mode
```bash
# Install nodemon for auto-restart
npm install -g nodemon

# Start with auto-restart
nodemon server.js
```

## 📞 Support

**Developer**: Amit Singh Gujjar  
**Contact**: +91 6396612125

---

## 🎯 Usage Guide

### For Admin:
1. Login with admin credentials (admin/admin123)
2. Go to Admin Panel
3. Upload notes/question banks
4. Create quizzes
5. Delete old content
6. Monitor statistics

### For Students:
1. Login with student credentials (student/student123)
2. Browse subjects
3. Download notes/question banks
4. Take quizzes
5. View results

---

## 🚀 Ready to Publish?

### **Choose Your Method:**

#### **🔰 Beginner (Local Network):**
```bash
Double-click: start-network-server.bat
Share IP with students
```

#### **🎓 Online Publishing:**
```bash
Double-click: deploy-to-github.bat
Follow GitHub + Vercel setup
```

#### **🏢 Professional:**
```bash
Double-click: setup-pm2.bat
Configure domain and SSL
```

#### **🔧 All Options:**
```bash
Double-click: server-manager.bat
Choose from menu
```

---

**🎉 Portal ready to publish! Choose your method और students को access दें! 📚✨**
