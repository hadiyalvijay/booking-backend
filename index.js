const express = require('express');
const connectToMongo = require('./db'); // Database connection
const cors = require('cors');
// const path = require('path');

const app = express();

// Connect to database
connectToMongo();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api', require('./routes/paymentRoutes'));
app.use('/api/expenses',require('./routes/expenseRoutes'));
app.use('/api/admin',  require('./routes/adminRoutes'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
