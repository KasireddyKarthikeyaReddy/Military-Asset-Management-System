import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import './models/index.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import purchaseRoutes from './routes/purchase.routes.js';
import transferRoutes from './routes/transfer.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';
import expenditureRoutes from './routes/expenditure.routes.js';
import userRoutes from './routes/user.routes.js';
import assetRoutes from './routes/asset.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   CORS CONFIGURATION (FIXED)
========================= */

const allowedOrigins = [
  'http://localhost:5173',
  'https://military-asset-management-system-gamma.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

/* =========================
   Global Middleware
========================= */

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   Health Check
========================= */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Military Asset Management API is running'
  });
});

/* =========================
   API Routes
========================= */

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);

/* =========================
   404 Handler
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

/* =========================
   Global Error Handler
========================= */

app.use(errorHandler);

/* =========================
   Start Server
========================= */

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
