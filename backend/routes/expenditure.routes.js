import express from 'express';
import { createExpenditure, getExpenditures, getExpenditureById } from '../controllers/expenditure.controller.js';
import { authenticate } from '../middleware/auth.js';
import { filterByBase } from '../middleware/rbac.js';
import { auditLog } from '../middleware/auditLog.js';

const router = express.Router();

// All expenditure routes require authentication
router.use(authenticate);

router.post('/', filterByBase, auditLog, createExpenditure);
router.get('/', filterByBase, auditLog, getExpenditures);
router.get('/:id', filterByBase, auditLog, getExpenditureById);

export default router;
