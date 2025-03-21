const Expense = require('../models/Expense');
// const multer = require('multer');
// const path = require('path');
const fs = require('fs');



exports.createExpense = async (req, res) => {
    try {
        console.log("Received Expense Data:", req.body); 
        
        const { description, category, amount, expenseDate, paymentMethod, notes } = req.body;

        if (!description || !category || !amount || !expenseDate || !paymentMethod) {
            console.log("⚠️ Missing Fields:", { description, category, amount, expenseDate, paymentMethod });
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newExpense = new Expense({
            description,
            category,
            amount: Number(amount),
            expenseDate,
            paymentMethod,
            notes
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        console.error("Error creating expense:", err);
        res.status(500).json({ error: "Failed to create expense", details: err.message });
    }
};


// Get All Expenses with Filters
exports.getExpenses = async (req, res) => {
    try {
        const { category, search, timeframe, sortBy } = req.query;
        let filter = {};

        // Filter by Category
        if (category && category !== 'all') {
            filter.category = category;
        }

        // Filter by Timeframe
        if (timeframe) {
            const now = new Date();
            let startDate, endDate;

            switch (timeframe) {
                case 'thisMonth':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    break;
                case 'lastMonth':
                    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                    break;
                case 'thisQuarter':
                    const quarter = Math.floor(now.getMonth() / 3);
                    startDate = new Date(now.getFullYear(), quarter * 3, 1);
                    endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
                    break;
                case 'thisYear':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    endDate = new Date(now.getFullYear(), 11, 31);
                    break;
                case 'lastYear':
                    startDate = new Date(now.getFullYear() - 1, 0, 1);
                    endDate = new Date(now.getFullYear() - 1, 11, 31);
                    break;
                default:
                    startDate = null;
                    endDate = null;
            }

            if (startDate && endDate) {
                filter.expenseDate = { $gte: startDate, $lte: endDate };
            }
        }

        // Search Query (Matches description)
        if (search) {
            filter.description = { $regex: search, $options: 'i' };
        }

        // Sorting
        let sortOptions = {};
        if (sortBy) {
            switch (sortBy) {
                case 'date':
                    sortOptions.expenseDate = -1; // Newest first
                    break;
                case 'dateAsc':
                    sortOptions.expenseDate = 1; // Oldest first
                    break;
                case 'amountDesc':
                    sortOptions.amount = -1; // Highest amount first
                    break;
                case 'amountAsc':
                    sortOptions.amount = 1; // Lowest amount first
                    break;
                default:
                    sortOptions.expenseDate = -1; // Default: Newest first
            }
        }

        // Fetch expenses with filters
        const expenses = await Expense.find(filter).sort(sortOptions);
        res.json(expenses);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
};


// Get Expense by ID
exports.getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        res.json(expense);
    } catch (err) {
        console.error('Error retrieving expense:', err);
        res.status(500).json({ error: 'Error retrieving expense' });
    }
};
exports.updateExpense = async (req, res) => {
    try {
        let updateData = { ...req.body };

        

        // Find existing expense
        const existingExpense = await Expense.findById(req.params.id);
        if (!existingExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

       

        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, updateData, { new: true });

        res.json(updatedExpense);
    } catch (err) {
        console.error('Error updating expense:', err);
        res.status(500).json({ error: 'Error updating expense' });
    }
};


exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

      

        await Expense.findByIdAndDelete(req.params.id);

        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error('Error deleting expense:', err);
        res.status(500).json({ error: 'Error deleting expense' });
    }
};

// Export the Multer Upload Middleware
// exports.upload = upload;
