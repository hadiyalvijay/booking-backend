const Payment = require("../models/Payment");

// 🔹 Get Payments (All or by Booking ID)
exports.getPayments = async (req, res) => {
    try {
        const { bookingId, status, timeframe, paymentMethod, search } = req.query;

        let query = {};

        if (bookingId) query.bookingId = bookingId;
        if (status && status !== "all") query.status = status;
        if (paymentMethod && paymentMethod !== "all") query.paymentMethod = paymentMethod;

        // Handle timeframe filtering (e.g., "thisMonth", "lastMonth", etc.)
        if (timeframe) {
            const now = new Date();
            const start = new Date();
            const end = new Date();

            if (timeframe === "thisMonth") {
                start.setDate(1);
                end.setMonth(end.getMonth() + 1, 0);
            } else if (timeframe === "lastMonth") {
                start.setMonth(start.getMonth() - 1, 1);
                end.setDate(0);
            } else if (timeframe === "thisYear") {
                start.setMonth(0, 1);
                end.setMonth(11, 31);
            } else if (timeframe === "lastYear") {
                start.setFullYear(start.getFullYear() - 1, 0, 1);
                end.setFullYear(end.getFullYear() - 1, 11, 31);
            }

            query.paymentDate = { $gte: start, $lte: end };
        }

        // Handle search filter (searching by client name)
        if (search) {
            query["booking.clientName"] = { $regex: search, $options: "i" };
        }

        console.log(`🔍 Searching payments with filters:`, query);

        const payments = await Payment.find(query);

        if (!payments.length) {
            return res.status(404).json({ message: "No payments found" });
        }

        res.json(payments);
    }catch (error) {
        console.error("Error Details:", error); // Detailed Error Logging
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
    
};


exports.createPayment = async (req, res) => {
    try {
        console.log("Incoming Payment Data:", req.body); // 👈 Add this log

        const { bookingId, amount, paymentMethod, status, transactionId, notes, paymentDate } = req.body;

        if (!bookingId || !amount || !paymentMethod || !status || !transactionId || !notes || !paymentDate) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const payment = new Payment({
            bookingId,
            amount,
            paymentMethod,
            status,
            transactionId,
            notes,
            paymentDate
        });

        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        console.error("Error Details:", error); // Detailed Error Logging
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
    
};


// 🔹 Get All Payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate("bookingId");
        res.json(payments);
    } catch (error) {
        console.error("Error Details:", error); // Detailed Error Logging
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
    
};

// 🔹 Get Payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id).populate("bookingId");
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.json(payment);
    } catch (error) {
        console.error("Error Details:", error); // Detailed Error Logging
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
    
};

// 🔹 Delete Payment
exports.deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByIdAndDelete(id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.json({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error("Error Details:", error); // Detailed Error Logging
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
    
};
