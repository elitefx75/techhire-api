const express = require('express');

const router = express.Router();

const {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
} = require('../controllers/paymentControllers');

// GET all payments
router.get('/', getPayments);

// GET payment by ID
router.get('/:id', getPaymentById);

// POST payment
router.post('/', createPayment);

// PUT payment
router.put('/:id', updatePayment);

// DELETE payment
router.delete('/:id', deletePayment);

module.exports = router;