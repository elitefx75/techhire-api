const payment = require('../models/payment');

// GET all payments
const getPayments = async (req, res) => {
  try {
    const payments = await payment.find()
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
    const paymentDoc = await payment.findById(req.params.id)
      .populate('bookingId')
      .populate('userId');

    if (!paymentDoc) {
      return res.status(404).json({
        message: 'payment not found'
      });
    }

    res.status(200).json(paymentDoc);
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

    const paymentDoc = new payment({
      bookingId,
      userId,
      amount,
      paymentMethod,
      paymentStatus: paymentStatus || 'pending',
      transactionId
    });

    const savedPayment = await paymentDoc.save();

    res.status(201).json({
      message: 'payment created successfully',
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
    const paymentDoc = await payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!paymentDoc) {
      return res.status(404).json({
        message: 'payment not found'
      });
    }

    res.status(200).json({
      message: 'payment updated successfully',
      payment: paymentDoc
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
    const paymentDoc = await payment.findByIdAndDelete(req.params.id);

    if (!paymentDoc) {
      return res.status(404).json({
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      message: 'payment deleted successfully'
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