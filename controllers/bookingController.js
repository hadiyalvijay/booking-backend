const Booking = require('../models/Booking');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Requires authentication)
exports.createBooking = async (req, res) => {
  try {
    const {
      clientName,
      clientPhone,
      eventType,
      startDateTime,
      endDateTime,
      location,
      equipment,
      notes,
      totalAmount,
      depositAmount
    } = req.body;

    // Validation
    if (!clientName || !clientPhone || !startDateTime || !endDateTime || !location || !totalAmount) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if endDateTime is after startDateTime
    if (new Date(endDateTime) <= new Date(startDateTime)) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Calculate status based on payment
    let status = 'Pending';
    if (totalAmount === 0 || (depositAmount && depositAmount >= totalAmount)) {
      status = 'Confirmed';
    }

    const newBooking = new Booking({
      clientName,
      clientPhone,
      eventType,
      startDateTime,
      endDateTime,
      location,
      equipment,
      notes,
      totalAmount,
      depositAmount,
      status
    });

    const booking = await newBooking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    console.log("Received query params:", req.query); // Debug log
    let query = {}; // Default empty filter

    // Status filter
    // Make this more explicit and add logging
if (req.query.status && req.query.status !== 'all') {
  console.log("Filtering by status:", req.query.status);
  query.status = req.query.status;
  console.log("Query after adding status:", query);
}
    // Search filter
    if (req.query.search && req.query.search.trim() !== '') {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { clientName: searchRegex },
        { location: searchRegex },
        { eventType: searchRegex }
      ];
    }

    // Timeframe filter
    if (req.query.timeframe && req.query.timeframe !== 'all') {
      const now = new Date();
      if (req.query.timeframe === 'upcoming') {
        query.startDateTime = { $gte: now }; // Future bookings
      } else if (req.query.timeframe === 'past') {
        query.endDateTime = { $lt: now }; // Past bookings
      } else if (req.query.timeframe === 'thisMonth') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        query.startDateTime = { $gte: startOfMonth, $lte: endOfMonth };
      } else if (req.query.timeframe === 'nextMonth') {
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        query.startDateTime = { $gte: startOfNextMonth, $lte: endOfNextMonth };
      }
    }

    console.log("Final MongoDB Query:", query);

    const bookings = await Booking.find(query).sort({ startDateTime: 1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a booking by ID
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
  try {
    const bookingData = {...req.body};
    
    // Update status based on payment if total and deposit amounts are provided
    if (bookingData.totalAmount !== undefined && bookingData.depositAmount !== undefined) {
      const totalAmount = Number(bookingData.totalAmount);
      const depositAmount = Number(bookingData.depositAmount);
      
      // Only update status if it's not already Completed or Cancelled
      if (!['Completed', 'Cancelled'].includes(bookingData.status)) {
        if (totalAmount === 0 || depositAmount >= totalAmount) {
          bookingData.status = 'Confirmed';
        } else {
          bookingData.status = 'Pending';
        }
      }
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      bookingData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(updatedBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a booking by ID
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};