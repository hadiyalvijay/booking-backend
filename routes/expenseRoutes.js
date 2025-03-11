const express = require('express');
const { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } = require('../controllers/expenseController');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });


const router = express.Router();

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.put('/:id',updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;