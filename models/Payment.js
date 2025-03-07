const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { 
        type: String, 
        enum: ['cash', 'creditCard', 'bankTransfer', 'paypal', 'check', 'other'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed'], 
        required: true 
    },
    transactionId: { type: String, unique: true, required: true },
    notes: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
