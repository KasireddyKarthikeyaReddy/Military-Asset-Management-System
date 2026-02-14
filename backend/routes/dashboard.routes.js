import express from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.js';
import { filterByBase } from '../middleware/rbac.js';
import { auditLog } from '../middleware/auditLog.js';

const router = express.Router();

router.get('/', authenticate, filterByBase, auditLog, getDashboardData);

export default router;
