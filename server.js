const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'poly_study_portal_secret_key_2024';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for frontend
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'file://'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static('.'));

// Create directories if they don't exist
const ensureDirectories = () => {
  const dirs = ['uploads', 'uploads/notes', 'uploads/question-banks', 'data'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.body.type === 'question-bank' ? 'uploads/question-banks' : 'uploads/notes';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    cb(null, `${timestamp}-${sanitizedName}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// In-memory database (replace with MongoDB in production)
let database = {
  users: [
    {
      id: 1,
      username: 'student',
      password: 'student123',
      role: 'student'
    },
    {
      id: 2,
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: 3,
      username: 'STUDENT@POLY',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // POLY@1122
      role: 'student'
    },
    {
      id: 4,
      username: 'AMIT@POLY',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // AMIT@POLY
      role: 'admin'
    }
  ],
  subjects: [
    {
      id: 1,
      name: "English",
      code: "ENG",
      topics: []
    },
    {
      id: 2,
      name: "Mathematics",
      code: "MAT",
      topics: []
    },
    {
      id: 3,
      name: "Chemistry",
      code: "CHEM",
      topics: []
    },
    {
      id: 4,
      name: "Physics",
      code: "PHY",
      topics: []
    },
    {
      id: 5,
      name: "Engineering Drawing",
      code: "ED",
      topics: []
    },
    {
      id: 6,
      name: "Computer",
      code: "COMP",
      topics: []
    }
  ],
  quizzes: {},
  uploads: []
};

// Load existing data
const loadDatabase = () => {
  try {
    if (fs.existsSync('data/database.json')) {
      const data = fs.readFileSync('data/database.json', 'utf8');
      database = { ...database, ...JSON.parse(data) };
      console.log('✅ Database loaded from file');
    }
  } catch (error) {
    console.log('⚠️ Could not load database, using defaults');
  }
};

// Save database
const saveDatabase = () => {
  try {
    fs.writeFileSync('data/database.json', JSON.stringify(database, null, 2));
    console.log('✅ Database saved');
  } catch (error) {
    console.error('❌ Error saving database:', error);
  }
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Routes

// Authentication
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = database.users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check credentials - Updated for consistency
    let validCredentials = false;
    
    if (username === 'admin' && password === 'admin123') {
      validCredentials = true;
      user.role = 'admin';
    } else if (username === 'student' && password === 'student123') {
      validCredentials = true;
      user.role = 'student';
    } else if (username === 'AMIT@POLY' && password === 'AMIT@POLY') {
      validCredentials = true;
      user.role = 'admin';
    } else if (username === 'STUDENT@POLY' && password === 'POLY@1122') {
      validCredentials = true;
      user.role = 'student';
    }
    
    if (!validCredentials) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all subjects
app.get('/api/subjects', authenticateToken, (req, res) => {
  res.json({
    success: true,
    subjects: database.subjects
  });
});

// Get subject by name
app.get('/api/subjects/:name', authenticateToken, (req, res) => {
  const subject = database.subjects.find(s => 
    s.name.toLowerCase() === req.params.name.toLowerCase()
  );
  
  if (!subject) {
    return res.status(404).json({ error: 'Subject not found' });
  }

  res.json({
    success: true,
    subject
  });
});

// Upload notes/question bank
app.post('/api/upload', authenticateToken, requireAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { subject, title, description, type } = req.body;
    
    if (!subject || !title) {
      return res.status(400).json({ error: 'Subject and title required' });
    }

    const subjectObj = database.subjects.find(s => s.name === subject);
    if (!subjectObj) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Find or create topic
    let topic = subjectObj.topics.find(t => t.title === title);
    if (!topic) {
      topic = {
        id: Date.now(),
        title,
        notes: null,
        qb: null,
        quizId: null,
        description: description || '',
        uploadedBy: req.user.username,
        uploadDate: new Date().toISOString()
      };
      subjectObj.topics.push(topic);
    }

    // Update topic with file path
    const filePath = `/uploads/${type === 'question-bank' ? 'question-banks' : 'notes'}/${req.file.filename}`;
    if (type === 'question-bank') {
      topic.qb = filePath;
    } else {
      topic.notes = filePath;
    }

    // Add to uploads log
    database.uploads.push({
      id: Date.now(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      type,
      subject,
      title,
      path: filePath,
      size: req.file.size,
      uploadedBy: req.user.username,
      uploadDate: new Date().toISOString()
    });

    saveDatabase();

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        path: filePath,
        size: req.file.size
      },
      topic
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

// Create quiz
app.post('/api/quiz', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { subject, title, questions } = req.body;
    
    if (!subject || !title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Invalid quiz data' });
    }

    const quizId = `${subject.toLowerCase().replace(/\s+/g, '_')}_${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    database.quizzes[quizId] = {
      id: quizId,
      title: `${subject}: ${title}`,
      subject,
      questions,
      createdBy: req.user.username,
      createdDate: new Date().toISOString()
    };

    saveDatabase();

    res.json({
      success: true,
      message: 'Quiz created successfully',
      quizId,
      quiz: database.quizzes[quizId]
    });
  } catch (error) {
    console.error('Quiz creation error:', error);
    res.status(500).json({ error: 'Quiz creation failed' });
  }
});

// Get quiz by ID
app.get('/api/quiz/:id', authenticateToken, (req, res) => {
  const quiz = database.quizzes[req.params.id];
  
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  res.json({
    success: true,
    quiz
  });
});

// Get all quizzes
app.get('/api/quizzes', authenticateToken, (req, res) => {
  res.json({
    success: true,
    quizzes: database.quizzes
  });
});

// Delete topic
app.delete('/api/topic', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { subjectName, topicTitle } = req.body;
    
    if (!subjectName || !topicTitle) {
      return res.status(400).json({ error: 'Subject name and topic title are required' });
    }

    // Find the subject
    const subjectIndex = database.subjects.findIndex(s => s.name === subjectName);
    if (subjectIndex === -1) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Find the topic
    const topicIndex = database.subjects[subjectIndex].topics.findIndex(t => t.title === topicTitle);
    if (topicIndex === -1) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const topic = database.subjects[subjectIndex].topics[topicIndex];

    // Delete associated files
    if (topic.notes) {
      const notesPath = path.join(__dirname, 'uploads', topic.notes);
      if (fs.existsSync(notesPath)) {
        fs.unlinkSync(notesPath);
      }
    }
    if (topic.qb) {
      const qbPath = path.join(__dirname, 'uploads', topic.qb);
      if (fs.existsSync(qbPath)) {
        fs.unlinkSync(qbPath);
      }
    }

    // Remove topic from database
    database.subjects[subjectIndex].topics.splice(topicIndex, 1);

    // Remove from uploads log
    database.uploads = database.uploads.filter(upload => 
      !(upload.type === 'topic' && upload.title === topicTitle && upload.subject === subjectName)
    );

    saveDatabase();

    res.json({
      success: true,
      message: `Topic "${topicTitle}" deleted successfully`
    });

  } catch (error) {
    console.error('Topic deletion error:', error);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

// Delete quiz
app.delete('/api/quiz/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const quizId = req.params.id;
    
    if (!database.quizzes[quizId]) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = database.quizzes[quizId];
    
    // Remove quiz from database
    delete database.quizzes[quizId];

    // Remove from uploads log
    database.uploads = database.uploads.filter(upload => 
      !(upload.type === 'quiz' && upload.title === quiz.title)
    );

    saveDatabase();

    res.json({
      success: true,
      message: `Quiz "${quiz.title}" deleted successfully`
    });

  } catch (error) {
    console.error('Quiz deletion error:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// Get upload statistics (admin only)
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  const totalSubjects = database.subjects.length;
  const totalTopics = database.subjects.reduce((sum, subject) => sum + subject.topics.length, 0);
  const totalQuizzes = Object.keys(database.quizzes).length;
  const totalUploads = database.uploads.length;
  const recentUploads = database.uploads
    .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
    .slice(0, 10);

  res.json({
    success: true,
    stats: {
      totalSubjects,
      totalTopics,
      totalQuizzes,
      totalUploads,
      recentUploads
    }
  });
});

// Download file
app.get('/uploads/*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath);
});

// Get all resources
app.get('/api/resources', authenticateToken, (req, res) => {
  const resources = [];
  
  database.subjects.forEach(subject => {
    subject.topics.forEach(topic => {
      if (topic.notes) {
        resources.push({
          type: 'Notes',
          subject: subject.name,
          title: topic.title,
          path: topic.notes,
          description: topic.description,
          uploadDate: topic.uploadDate
        });
      }
      if (topic.qb) {
        resources.push({
          type: 'Question Bank',
          subject: subject.name,
          title: topic.title,
          path: topic.qb,
          description: topic.description,
          uploadDate: topic.uploadDate
        });
      }
    });
  });

  res.json({
    success: true,
    resources
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
  }
  
  res.status(500).json({ error: error.message || 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize server
const startServer = () => {
  ensureDirectories();
  loadDatabase();
  
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Poly Study Portal Backend Server Started!');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🌐 Network access: http://0.0.0.0:${PORT}`);
    console.log(`📁 Static files served from: ${__dirname}`);
    console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
    console.log(`💾 Database: ${fs.existsSync('data/database.json') ? 'Loaded' : 'Using defaults'}`);
    console.log('');
    console.log('📱 Mobile/Network Access:');
    console.log('  Same WiFi network से mobile पर access करें');
    console.log('  Your local IP address use करें');
    console.log('');
    console.log('📋 Available Endpoints:');
    console.log('  POST /api/login - User authentication');
    console.log('  GET  /api/subjects - Get all subjects');
    console.log('  GET  /api/subjects/:name - Get specific subject');
    console.log('  POST /api/upload - Upload files (admin only)');
    console.log('  POST /api/quiz - Create quiz (admin only)');
    console.log('  GET  /api/quiz/:id - Get specific quiz');
    console.log('  GET  /api/quizzes - Get all quizzes');
    console.log('  GET  /api/resources - Get all resources');
    console.log('  GET  /api/admin/stats - Get admin statistics');
    console.log('  GET  /uploads/* - Download files');
    console.log('');
    console.log('🔗 Frontend URL: http://localhost:3000');
    console.log('👤 Admin Login: admin / admin123');
    console.log('🎓 Student Login: student / student123');
    console.log('');
    console.log('📋 Alternative Credentials:');
    console.log('👤 Admin: AMIT@POLY / AMIT@POLY');
    console.log('🎓 Student: STUDENT@POLY / POLY@1122');
  });
  
  return server;
};

// Start the server
const server = startServer();

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  console.log('🔄 Server will restart...');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  console.log('🔄 Server will restart...');
  process.exit(1);
});

module.exports = app;
