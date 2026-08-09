const express = require('express');

const router = express.Router();

const {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewControllers');

// GET all reviews
router.get('/', getReviews);

// GET review by ID
router.get('/:id', getReviewById);

// POST review
router.post('/', createReview);

// PUT review
router.put('/:id', updateReview);

// DELETE review
router.delete('/:id', deleteReview);

module.exports = router;