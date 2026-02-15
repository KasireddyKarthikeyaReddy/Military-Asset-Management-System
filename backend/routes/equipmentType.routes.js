import express from 'express';
import {
  createEquipmentType,
  getEquipmentTypes
} from '../controllers/equipmentType.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All equipment type routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/equipment-types
 * @desc    Create new equipment type
 * @access  Authenticated users (you can later restrict to admin only)
 */
router.post('/', createEquipmentType);

/**
 * @route   GET /api/equipment-types
 * @desc    Get all equipment types
 * @access  Authenticated users
 */
router.get('/', getEquipmentTypes);

export default router;
