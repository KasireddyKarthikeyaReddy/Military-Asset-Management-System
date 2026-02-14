import express from 'express';
import { createPurchase, getPurchases, getPurchaseById } from '../controllers/purchase.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, filterByBase } from '../middleware/rbac.js';
import { auditLog } from '../middleware/auditLog.js';

const router = express.Router();

// All purchase routes require authentication
router.use(authenticate);

// Only admin and logistics officer can create purchases
router.post('/', requireRole('admin', 'logistics_officer'), filterByBase, auditLog, createPurchase);

// All authenticated users can view purchases (filtered by role)
router.get('/', filterByBase, auditLog, getPurchases);
router.get('/:id', filterByBase, auditLog, getPurchaseById);

export default router;
