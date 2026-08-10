const express = require('express');
const { ensureAuthenticated } = require('../middleware/auth');

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
router.post('/', ensureAuthenticated, createReview);

// PUT review
router.put('/:id', ensureAuthenticated, updateReview);

// DELETE review
router.delete('/:id', ensureAuthenticated, deleteReview);

module.exports = router;