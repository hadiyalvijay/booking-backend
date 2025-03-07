const express = require('express');
const { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } = require('../controllers/expenseController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // No "../frontend/"


const router = express.Router();

router.post('/', upload.single('receipt'), createExpense);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.put('/:id', upload.single('receipt'), updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;