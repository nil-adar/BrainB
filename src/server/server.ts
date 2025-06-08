
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { messageRouter } from './routes/messages';

import { userRouter } from './routes/user.routes';

import { authRouter } from './routes/auth.routes';
import { profileRouter } from './routes/profiles'; // 
import { UserProfileModel } from './models/UserProfile';
import { router as scheduleRouter } from './routes/schedule.routes';
import studentRoutes from './routes/student.routes';
import diagnosticRoutes from "./routes/diagnostic.routes";
import taskRoutes from "./routes/task.routes";
import formRouter from "./routes/form.routes";
import recommendationRoutes from './routes/recommendation.routes';


const app = express();//sandra
app.use('/api', recommendationRoutes);//sandra

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`🔹 [${timestamp}] Request incoming: ${req.method} ${req.originalUrl}`);
  console.log(`Headers:`, req.headers);
  next();
});
app.use('/api/users', userRouter);
app.use('/api/users', authRouter);
app.use("/api/students", studentRoutes);
app.use('/api/profiles',profileRouter);
app.use('/api/schedule', scheduleRouter);
app.use("/api/students", studentRoutes);
app.use('/api/messages', messageRouter);
app.use("/api/diagnostic", diagnosticRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/students', studentRoutes);
app.use('/api', taskRoutes);
app.use("/api/forms", formRouter);




// MongoDB connection
// Using environment variable for MongoDB URI when available
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://niladar:RX1DRQF36Rsavqgx@schoolsdata.yg5ih.mongodb.net/BrainB';


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      serverSelectionTimeoutMS: 5000, // 5 שניות timeout
      socketTimeoutMS: 10000, // 10 שניות timeout
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('🚨 MongoDB connection error:', error);
    process.exit(1);
  }
};



// Connect to MongoDB
connectDB();
mongoose.connection.once('open', () => {
  console.log("✅ Connected to MongoDB database:", mongoose.connection.name);
});

mongoose.connection.on('error', (error) => {
  console.error("❌ MongoDB Error:", error);
});

mongoose.connection.on('disconnected', () => {
  console.warn("⚠️ MongoDB disconnected");
});

mongoose.connection.on('reconnected', () => {
  console.info("🔄 MongoDB reconnected");
});



// API endpoint for checking database connection
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'running',
    dbConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// API endpoint to update MongoDB connection string (for development purposes only)
app.post('/api/mongo/config', (req, res) => {
  const { uri } = req.body;
  
  if (!uri) {
    res.status(400).json({ 
      success: false,
      message: 'MongoDB URI is required' 
    });
    return;
  }
  
  // Disconnect from current database if connected
  if (mongoose.connection.readyState === 1) {
    mongoose.disconnect()
      .then(() => {
        console.log('Disconnected from previous MongoDB instance');
        // Connect to new URI
        return mongoose.connect(process.env.MONGO_URI!);

      })
      .then(() => {
        console.log('Connected to new MongoDB instance successfully');
        res.json({ 
          success: true,
          message: 'MongoDB connection updated successfully',
          dbConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
        });
      })
      .catch((error) => {
        console.error('Error updating MongoDB connection:', error);
        res.status(500).json({ 
          success: false,
          message: 'Failed to update MongoDB connection',
          error: error instanceof Error ? error.message : String(error)
        });
      });
  } else {
    // If not connected, just connect to the new URI
    mongoose.connect(uri)
      .then(() => {
        console.log('Connected to new MongoDB instance successfully');
        res.json({ 
          success: true,
          message: 'MongoDB connection updated successfully',
          dbConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
        });
      })
      .catch((error) => {
        console.error('Error updating MongoDB connection:', error);
        res.status(500).json({ 
          success: false,
          message: 'Failed to update MongoDB connection',
          error: error instanceof Error ? error.message : String(error)
        });
      });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

