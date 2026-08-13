
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

// Import models and controllers
const Review = require('../models/review');
const reviewControllers = require('../controllers/reviewControllers');

describe('Review Controller', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getReviews', () => {
        it('should return all reviews', async () => {
            const mockReviews = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    userId: new mongoose.Types.ObjectId(),
                    equipmentId: new mongoose.Types.ObjectId(),
                    rating: 5,
                    comment: 'Excellent equipment!'
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    userId: new mongoose.Types.ObjectId(),
                    equipmentId: new mongoose.Types.ObjectId(),
                    rating: 4,
                    comment: 'Good quality'
                }
            ];

            const findStub = sandbox.stub(Review, 'find').returns({
                populate: sandbox.stub().returns({
                    populate: sandbox.stub().resolves(mockReviews)
                })
            });

            const req = {};
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await reviewControllers.getReviews(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.status().json.called).to.be.true;
        });

        it('should handle errors when fetching reviews', async () => {
            const error = new Error('Database error');
            sandbox.stub(Review, 'find').throws(error);

            const req = {};
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await reviewControllers.getReviews(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    describe('getReviewById', () => {
        it('should return a single review by ID', async () => {
            const reviewId = new mongoose.Types.ObjectId();
            const mockReview = {
                _id: reviewId,
                rating: 5,
                comment: 'Great!'
            };

            const findByIdStub = sandbox.stub(Review, 'findById').returns({
                populate: sandbox.stub().returns({
                    populate: sandbox.stub().resolves(mockReview)
                })
            });

            const req = { params: { id: reviewId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await reviewControllers.getReviewById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should return 404 when review not found', async () => {
            const reviewId = new mongoose.Types.ObjectId();

            const findByIdStub = sandbox.stub(Review, 'findById').returns({
                populate: sandbox.stub().returns({
                    populate: sandbox.stub().resolves(null)
                })
            });

            const req = { params: { id: reviewId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await reviewControllers.getReviewById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });

    describe('createReview', () => {
        it('should create a new review with valid data', async () => {
            const reviewData = {
                userId: new mongoose.Types.ObjectId(),
                equipmentId: new mongoose.Types.ObjectId(),
                rating: 5,
                comment: 'Excellent equipment!'
            };

            const mockReview = { _id: new mongoose.Types.ObjectId(), ...reviewData };

            sandbox.stub(Review.prototype, 'save').resolves(mockReview);

            const req = { body: reviewData };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await reviewControllers.createReview(req, res);

            expect(res.status.calledWith(201)).to.be.true;
        });

        it('should return 400 when required fields are missing', async () => {
            const incompleteData = {
                userId: new mongoose.Types.ObjectId(),
                // Missing equipmentId, rating, comment
            };

            const req = { body: incompleteData };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await reviewControllers.createReview(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });

        it('should return 400 when rating is out of range', async () => {
            const reviewData = {
                userId: new mongoose.Types.ObjectId(),
                equipmentId: new mongoose.Types.ObjectId(),
                rating: 10, // Invalid: should be 1-5
                comment: 'Test'
            };

            const req = { body: reviewData };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await reviewControllers.createReview(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });

        it('should return 400 when rating is too low', async () => {
            const reviewData = {
                userId: new mongoose.Types.ObjectId(),
                equipmentId: new mongoose.Types.ObjectId(),
                rating: 0, // Invalid: should be 1-5
                comment: 'Test'
            };

            const req = { body: reviewData };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await reviewControllers.createReview(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });
    });

    describe('updateReview', () => {
        it('should update an existing review', async () => {
            const reviewId = new mongoose.Types.ObjectId();
            const updateData = { rating: 4, comment: 'Good' };
            const updatedReview = { _id: reviewId, ...updateData };

            sandbox.stub(Review, 'findByIdAndUpdate').resolves(updatedReview);

            const req = { params: { id: reviewId }, body: updateData };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await reviewControllers.updateReview(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should return 404 when review not found for update', async () => {
            const reviewId = new mongoose.Types.ObjectId();

            sandbox.stub(Review, 'findByIdAndUpdate').resolves(null);

            const req = { params: { id: reviewId }, body: {} };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await reviewControllers.updateReview(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });

    describe('deleteReview', () => {
        it('should delete a review', async () => {
            const reviewId = new mongoose.Types.ObjectId();
            const deletedReview = { _id: reviewId };

            sandbox.stub(Review, 'findByIdAndDelete').resolves(deletedReview);

            const req = { params: { id: reviewId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await reviewControllers.deleteReview(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should return 404 when review not found for deletion', async () => {
            const reviewId = new mongoose.Types.ObjectId();

            sandbox.stub(Review, 'findByIdAndDelete').resolves(null);

            const req = { params: { id: reviewId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await reviewControllers.deleteReview(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });
});
