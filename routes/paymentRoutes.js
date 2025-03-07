const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/payments', paymentController.getPayments);
router.post('/payments', paymentController.createPayment);

module.exports = router;
