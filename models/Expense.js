const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  expenseDate: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  receipt: { type: String }, // URL for uploaded receipt file
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);