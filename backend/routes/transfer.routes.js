import express from 'express';
import { createTransfer, getTransfers, getTransferById } from '../controllers/transfer.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, filterByBase } from '../middleware/rbac.js';
import { auditLog } from '../middleware/auditLog.js';

const router = express.Router();

// All transfer routes require authentication
router.use(authenticate);

// Only admin and logistics officer can create transfers
router.post('/', requireRole('admin', 'logistics_officer'), filterByBase, auditLog, createTransfer);

// All authenticated users can view transfers (filtered by role)
router.get('/', filterByBase, auditLog, getTransfers);
router.get('/:id', filterByBase, auditLog, getTransferById);

export default router;
