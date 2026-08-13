
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

// Import models and controllers
const Booking = require('../models/booking');
const bookingControllers = require('../controllers/bookingControllers');

describe('Booking Controller', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getBookings', () => {
        it('should return all bookings', async () => {
            const mockBookings = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    userId: 'user1',
                    equipment: 'eq1',
                    startDate: new Date(),
                    endDate: new Date(),
                    status: 'confirmed'
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    userId: 'user2',
                    equipment: 'eq2',
                    startDate: new Date(),
                    endDate: new Date(),
                    status: 'pending'
                }
            ];

            const findStub = sandbox.stub(Booking, 'find').returns({
                populate: sandbox.stub().resolves(mockBookings)
            });

            const req = {};
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await bookingControllers.getBookings(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.status().json.calledWith(mockBookings)).to.be.true;
        });

        it('should handle errors when fetching bookings', async () => {
            const error = new Error('Database error');
            sandbox.stub(Booking, 'find').throws(error);

            const req = {};
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await bookingControllers.getBookings(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    describe('createBooking', () => {
        it('should create a new booking', async () => {
            const bookingData = {
                userId: 'user1',
                equipment: new mongoose.Types.ObjectId(),
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000),
                status: 'pending',
                totalCost: 100
            };

            const mockBooking = { _id: new mongoose.Types.ObjectId(), ...bookingData };

            sandbox.stub(Booking, 'create').resolves(mockBooking);

            const req = { body: bookingData };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await bookingControllers.createBooking(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.status().json.called).to.be.true;
        });

        it('should return 400 error for invalid booking data', async () => {
            const error = new Error('Validation error');
            sandbox.stub(Booking, 'create').rejects(error);

            const req = { body: {} };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await bookingControllers.createBooking(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });
    });

    describe('updateBooking', () => {
        it('should update an existing booking', async () => {
            const bookingId = new mongoose.Types.ObjectId();
            const updateData = { status: 'confirmed' };
            const updatedBooking = { _id: bookingId, ...updateData };

            sandbox.stub(Booking, 'findByIdAndUpdate').resolves(updatedBooking);

            const req = { params: { id: bookingId }, body: updateData };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await bookingControllers.updateBooking(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.status().json.called).to.be.true;
        });

        it('should return 404 when booking not found', async () => {
            const bookingId = new mongoose.Types.ObjectId();

            sandbox.stub(Booking, 'findByIdAndUpdate').resolves(null);

            const req = { params: { id: bookingId }, body: {} };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await bookingControllers.updateBooking(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });

    describe('deleteBooking', () => {
        it('should delete a booking', async () => {
            const bookingId = new mongoose.Types.ObjectId();
            const deletedBooking = { _id: bookingId };

            sandbox.stub(Booking, 'findByIdAndDelete').resolves(deletedBooking);

            const req = { params: { id: bookingId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await bookingControllers.deleteBooking(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should return 404 when booking not found for deletion', async () => {
            const bookingId = new mongoose.Types.ObjectId();

            sandbox.stub(Booking, 'findByIdAndDelete').resolves(null);

            const req = { params: { id: bookingId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await bookingControllers.deleteBooking(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });
});
