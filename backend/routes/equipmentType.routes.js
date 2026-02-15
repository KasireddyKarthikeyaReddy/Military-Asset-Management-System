import express from 'express';
import {
  createEquipmentType,
  getEquipmentTypes,
  getEquipmentTypeById
} from '../controllers/equipmentType.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Admin only create
router.post('/', requireRole('admin'), createEquipmentType);

// Admin + Logistics + Commander can view
router.get('/', requireRole('admin', 'logistics_officer', 'base_commander'), getEquipmentTypes);

router.get('/:id', requireRole('admin', 'logistics_officer', 'base_commander'), getEquipmentTypeById);

export default router;
