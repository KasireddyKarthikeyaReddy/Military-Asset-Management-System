import express from 'express';
import { createAssignment, getAssignments, returnAssignment } from '../controllers/assignment.controller.js';
import { authenticate } from '../middleware/auth.js';
import { filterByBase } from '../middleware/rbac.js';
import { auditLog } from '../middleware/auditLog.js';

const router = express.Router();

// All assignment routes require authentication
router.use(authenticate);

router.post('/', filterByBase, auditLog, createAssignment);
router.get('/', filterByBase, auditLog, getAssignments);
router.patch('/:id/return', filterByBase, auditLog, returnAssignment);

export default router;
