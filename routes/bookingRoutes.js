const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking } = require('../controllers/bookingController');
const auth = require('../middleware/auth'); // Middleware for authentication

router.post('/', auth, createBooking);        // Create a new booking
router.get('/', auth, getAllBookings);        // Get all bookings
router.get('/:id', auth, getBookingById);     // Get booking by ID
router.put('/:id', auth, updateBooking);      // Update booking by ID
router.delete('/:id', auth, deleteBooking);   // Delete booking by ID

module.exports = router;
