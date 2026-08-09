const Review = require('../models/Review');

// GET all reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
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
    const review = await Review.findById(req.params.id)
      .populate('userId')
      .populate('equipmentId');

    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    res.status(200).json(review);
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

    const review = new Review({
      userId,
      equipmentId,
      rating,
      comment
    });

    const savedReview = await review.save();

    res.status(201).json({
      message: 'Review created successfully',
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
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    res.status(200).json({
      message: 'Review updated successfully',
      review
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
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    res.status(200).json({
      message: 'Review deleted successfully'
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