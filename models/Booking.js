const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientPhone: { type: String, required: true },
  eventType: { type: String },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  location: { type: String, required: true },
  equipment: { type: String },
  notes: { type: String },
  totalAmount: { type: Number, required: true },
  depositAmount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);