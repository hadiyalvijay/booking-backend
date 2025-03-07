
// routes/adminRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');
const router = express.Router();


// Admin Register API (Create New Admin)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if admin already exists
        let admin = await Admin.findOne({ email });
        if (admin) return res.status(400).json({ error: 'Admin already exists' });

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        admin = new Admin({
            name,
            email,
            password: hashedPassword,
            role: role || 'admin' // Default role 'admin'
        });

        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ error: 'Admin not found' });
        
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_KEY, { expiresIn: '1h' });
        res.json({ token, admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Admins (Protected Route)
router.get('/', auth, async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;