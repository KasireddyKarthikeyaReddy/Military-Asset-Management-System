import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import {
  createBase,
  getBases,
  getBaseById
} from '../controllers/base.controller.js';

const router = express.Router();

// Admin only create base
router.post('/', authenticate, requireRole('admin'), createBase);

// Admin & Logistics can view all bases
router.get('/', authenticate, requireRole('admin', 'logistics_officer'), getBases);

// Get single base
router.get('/:id', authenticate, requireRole('admin', 'logistics_officer'), getBaseById);

export default router;
