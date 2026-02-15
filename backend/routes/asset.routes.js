import express from 'express';
import {
  getAssets,
  getAssetById,
  createAsset
} from '../controllers/asset.controller.js';

import { authenticate } from '../middleware/auth.js';
import { filterByBase, requireRole } from '../middleware/rbac.js';
import { auditLog } from '../middleware/auditLog.js';

const router = express.Router();

// =====================================
// All asset routes require authentication
// =====================================
router.use(authenticate);

// =====================================
// Create Asset (Admin Only)
// =====================================
router.post(
  '/',
  requireRole('admin'),
  auditLog,
  createAsset
);

// =====================================
// Get All Assets
// =====================================
router.get(
  '/',
  filterByBase,
  auditLog,
  getAssets
);

// =====================================
// Get Asset By ID
// =====================================
router.get(
  '/:id',
  filterByBase,
  auditLog,
  getAssetById
);

export default router;
