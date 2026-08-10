const review = require('../models/review');

// GET all reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await review.find()
      .populate('userId')
      .populate('equipmentId');

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({
      message: 'Failed to retrieve reviews',
      error: error.message
    });
  }
};

// GET review by ID
const getReviewById = async (req, res) => {
  try {
    const reviewDoc = await review.findById(req.params.id)
      .populate('userId')
      .populate('equipmentId');

    if (!reviewDoc) {
      return res.status(404).json({
        message: 'review not found'
      });
    }

    res.status(200).json(reviewDoc);
  } catch (error) {
    console.error('Error getting review:', error);
    res.status(500).json({
      message: 'Failed to retrieve review',
      error: error.message
    });
  }
};

// CREATE review
const createReview = async (req, res) => {
  try {
    const {
      userId,
      equipmentId,
      rating,
      comment
    } = req.body;

    if (!userId || !equipmentId || rating === undefined || !comment) {
      return res.status(400).json({
        message: 'userId, equipmentId, rating and comment are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5'
      });
    }

    const reviewDoc = new review({
      userId,
      equipmentId,
      rating,
      comment
    });

    const savedReview = await reviewDoc.save();

    res.status(201).json({
      message: 'review created successfully',
      review: savedReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// UPDATE review
const updateReview = async (req, res) => {
  try {
    const reviewDoc = await review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!reviewDoc) {
      return res.status(404).json({
        message: 'review not found'
      });
    }

    res.status(200).json({
      message: 'review updated successfully',
      review: reviewDoc
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(400).json({
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// DELETE review
const deleteReview = async (req, res) => {
  try {
    const reviewDoc = await review.findByIdAndDelete(req.params.id);

    if (!reviewDoc) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    res.status(200).json({
      message: 'review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};