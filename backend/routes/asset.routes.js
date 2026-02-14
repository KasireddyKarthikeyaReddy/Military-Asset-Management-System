import express from 'express';
import { getAssets, getAssetById } from '../controllers/asset.controller.js';
import { authenticate } from '../middleware/auth.js';
import { filterByBase } from '../middleware/rbac.js';
import { auditLog } from '../middleware/auditLog.js';

const router = express.Router();

// All asset routes require authentication
router.use(authenticate);

router.get('/', filterByBase, auditLog, getAssets);
router.get('/:id', filterByBase, auditLog, getAssetById);

export default router;
