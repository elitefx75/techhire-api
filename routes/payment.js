const express = require('express');
const { ensureAuthenticated } = require('../middleware/auth');

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
router.post('/', ensureAuthenticated, createPayment);

// PUT payment
router.put('/:id', ensureAuthenticated, updatePayment);

// DELETE payment
router.delete('/:id', ensureAuthenticated, deletePayment);

module.exports = router;