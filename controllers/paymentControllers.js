const Payment = require('../models/payment');

// GET all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('bookingId')
      .populate('userId');

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({
      message: 'Failed to retrieve payments',
      error: error.message
    });
  }
};

// GET one payment
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('bookingId')
      .populate('userId');

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found'
      });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error('Error getting payment:', error);
    res.status(500).json({
      message: 'Failed to retrieve payment',
      error: error.message
    });
  }
};

// CREATE payment
const createPayment = async (req, res) => {
  try {
    const {
      bookingId,
      userId,
      amount,
      paymentMethod,
      paymentStatus,
      transactionId
    } = req.body;

    if (
      !bookingId ||
      !userId ||
      amount === undefined ||
      !paymentMethod ||
      !transactionId
    ) {
      return res.status(400).json({
        message: 'bookingId, userId, amount, paymentMethod and transactionId are required'
      });
    }

    const payment = new Payment({
      bookingId,
      userId,
      amount,
      paymentMethod,
      paymentStatus: paymentStatus || 'pending',
      transactionId
    });

    const savedPayment = await payment.save();

    res.status(201).json({
      message: 'Payment created successfully',
      payment: savedPayment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      message: 'Failed to create payment',
      error: error.message
    });
  }
};

// UPDATE payment
const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      message: 'Payment updated successfully',
      payment
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(400).json({
      message: 'Failed to update payment',
      error: error.message
    });
  }
};

// DELETE payment
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({
      message: 'Failed to delete payment',
      error: error.message
    });
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
};