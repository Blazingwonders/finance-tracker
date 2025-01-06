// src/routes/expenses.js
import express from 'express';
import { getAllExpenses, createExpense } from '../controllers/expenseController.js';
import { validateExpense } from '../middleware/validateExpense.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(getAllExpenses));
router.post('/', validateExpense, asyncHandler(createExpense));

//router.get('/ai', asyncHandler(getAiResponse));

export default router;