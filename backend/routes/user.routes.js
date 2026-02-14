import express from 'express';
import { getUsers, getBases, getEquipmentTypes } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, filterByBase } from '../middleware/rbac.js';
import { auditLog } from '../middleware/auditLog.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Only admin can view all users
router.get('/', requireRole('admin'), auditLog, getUsers);

// All authenticated users can get bases and equipment types
router.get('/bases', auditLog, getBases);
router.get('/equipment-types', auditLog, getEquipmentTypes);

export default router;
