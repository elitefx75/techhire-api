/**
 * Validation Tests for PUT Routes
 * Tests that booking and equipment PUT routes validate data before updating
 */

const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

// Import models and controllers
const Booking = require('../models/booking');
const Equipment = require('../models/equipment');
const bookingControllers = require('../controllers/bookingControllers');
const equipmentControllers = require('../controllers/equipmentControllers');

describe('PUT Route Validation Tests', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Booking PUT Validation', () => {
        it('should enforce required fields on booking update', async () => {
            const bookingId = new mongoose.Types.ObjectId();

            // Simulate MongoDB validation error for missing required field
            const validationError = new Error('Validation failed: customerName is required');
            validationError.name = 'ValidationError';

            sandbox.stub(Booking, 'findByIdAndUpdate').rejects(validationError);

            const req = {
                params: { id: bookingId },
                body: { status: 'confirmed' } // Missing customerName
            };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await bookingControllers.updateBooking(req, res);

            // Should return 400 for validation error, not 500
            expect(res.status.calledWith(400)).to.be.true;
        });

        it('should allow partial updates with runValidators', async () => {
            const bookingId = new mongoose.Types.ObjectId();
            const updatedBooking = {
                _id: bookingId,
                status: 'confirmed'
            };

            sandbox.stub(Booking, 'findByIdAndUpdate').resolves(updatedBooking);

            const req = {
                params: { id: bookingId },
                body: { status: 'confirmed' }
            };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await bookingControllers.updateBooking(req, res);

            // Should succeed with 200 status
            expect(res.status.calledWith(200)).to.be.true;

            // Verify findByIdAndUpdate was called with runValidators: true
            const call = Booking.findByIdAndUpdate.getCall(0);
            expect(call.args[2].runValidators).to.equal(true);
        });
    });

    describe('Equipment PUT Validation', () => {
        it('should enforce required fields on equipment update', async () => {
            const equipmentId = new mongoose.Types.ObjectId();

            // Simulate MongoDB validation error for missing required field
            const validationError = new Error('Validation failed: pricePerDay is required');
            validationError.name = 'ValidationError';

            sandbox.stub(Equipment, 'findByIdAndUpdate').rejects(validationError);

            const req = {
                params: { id: equipmentId },
                body: { available: false } // Missing pricePerDay
            };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await equipmentControllers.updateEquipment(req, res);

            // Should return 400 for validation error, not 500
            expect(res.status.calledWith(400)).to.be.true;
        });

        it('should allow partial updates with runValidators', async () => {
            const equipmentId = new mongoose.Types.ObjectId();
            const updatedEquipment = {
                _id: equipmentId,
                available: false
            };

            sandbox.stub(Equipment, 'findByIdAndUpdate').resolves(updatedEquipment);

            const req = {
                params: { id: equipmentId },
                body: { available: false }
            };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await equipmentControllers.updateEquipment(req, res);

            // Should succeed with 200 status
            expect(res.status.calledWith(200)).to.be.true;

            // Verify findByIdAndUpdate was called with runValidators: true
            const call = Equipment.findByIdAndUpdate.getCall(0);
            expect(call.args[2].runValidators).to.equal(true);
        });
    });

    describe('Cross-Collection Validation Consistency', () => {
        it('should use runValidators on all PUT routes', async () => {
            // This test ensures all controllers follow the same pattern
            const bookingId = new mongoose.Types.ObjectId();
            const equipmentId = new mongoose.Types.ObjectId();

            sandbox.stub(Booking, 'findByIdAndUpdate').resolves({ _id: bookingId });
            sandbox.stub(Equipment, 'findByIdAndUpdate').resolves({ _id: equipmentId });

            // Test Booking
            const bookingReq = { params: { id: bookingId }, body: {} };
            const bookingRes = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };
            await bookingControllers.updateBooking(bookingReq, bookingRes);

            // Test Equipment
            const equipmentReq = { params: { id: equipmentId }, body: {} };
            const equipmentRes = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };
            await equipmentControllers.updateEquipment(equipmentReq, equipmentRes);

            // Both should have called findByIdAndUpdate with runValidators: true
            const bookingCall = Booking.findByIdAndUpdate.getCall(0);
            const equipmentCall = Equipment.findByIdAndUpdate.getCall(0);

            expect(bookingCall.args[2].runValidators).to.equal(true);
            expect(equipmentCall.args[2].runValidators).to.equal(true);
        });
    });
});
