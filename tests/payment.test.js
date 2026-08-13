
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

// Import models and controllers
const Payment = require('../models/payment');
const paymentControllers = require('../controllers/paymentControllers');

describe('Payment Controller', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getPayments', () => {
        it('should return all payments', async () => {
            const mockPayments = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    bookingId: new mongoose.Types.ObjectId(),
                    userId: new mongoose.Types.ObjectId(),
                    amount: 100,
                    paymentMethod: 'credit_card',
                    paymentStatus: 'completed',
                    transactionId: 'TXN-001'
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    bookingId: new mongoose.Types.ObjectId(),
                    userId: new mongoose.Types.ObjectId(),
                    amount: 150,
                    paymentMethod: 'bank_transfer',
                    paymentStatus: 'pending',
                    transactionId: 'TXN-002'
                }
            ];

            const findStub = sandbox.stub(Payment, 'find').returns({
                populate: sandbox.stub().returns({
                    populate: sandbox.stub().resolves(mockPayments)
                })
            });

            const req = {};
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await paymentControllers.getPayments(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.status().json.called).to.be.true;
        });

        it('should handle errors when fetching payments', async () => {
            const error = new Error('Database error');
            sandbox.stub(Payment, 'find').throws(error);

            const req = {};
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await paymentControllers.getPayments(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    describe('getPaymentById', () => {
        it('should return a single payment by ID', async () => {
            const paymentId = new mongoose.Types.ObjectId();
            const mockPayment = {
                _id: paymentId,
                amount: 100,
                paymentStatus: 'completed'
            };

            const findByIdStub = sandbox.stub(Payment, 'findById').returns({
                populate: sandbox.stub().returns({
                    populate: sandbox.stub().resolves(mockPayment)
                })
            });

            const req = { params: { id: paymentId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await paymentControllers.getPaymentById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should return 404 when payment not found', async () => {
            const paymentId = new mongoose.Types.ObjectId();

            const findByIdStub = sandbox.stub(Payment, 'findById').returns({
                populate: sandbox.stub().returns({
                    populate: sandbox.stub().resolves(null)
                })
            });

            const req = { params: { id: paymentId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await paymentControllers.getPaymentById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });

    describe('createPayment', () => {
        it('should create a new payment', async () => {
            const paymentData = {
                bookingId: new mongoose.Types.ObjectId(),
                userId: new mongoose.Types.ObjectId(),
                amount: 100,
                paymentMethod: 'credit_card',
                transactionId: 'TXN-123'
            };

            const mockPayment = { _id: new mongoose.Types.ObjectId(), ...paymentData };

            sandbox.stub(Payment.prototype, 'save').resolves(mockPayment);

            const req = { body: paymentData };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await paymentControllers.createPayment(req, res);

            expect(res.status.calledWith(201)).to.be.true;
        });

        it('should return 400 when required fields are missing', async () => {
            const incompleteData = {
                bookingId: new mongoose.Types.ObjectId(),
                // Missing userId, amount, paymentMethod, transactionId
            };

            const req = { body: incompleteData };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await paymentControllers.createPayment(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });
    });

    describe('updatePayment', () => {
        it('should update an existing payment', async () => {
            const paymentId = new mongoose.Types.ObjectId();
            const updateData = { paymentStatus: 'completed' };
            const updatedPayment = { _id: paymentId, ...updateData };

            sandbox.stub(Payment, 'findByIdAndUpdate').resolves(updatedPayment);

            const req = { params: { id: paymentId }, body: updateData };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await paymentControllers.updatePayment(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should return 404 when payment not found for update', async () => {
            const paymentId = new mongoose.Types.ObjectId();

            sandbox.stub(Payment, 'findByIdAndUpdate').resolves(null);

            const req = { params: { id: paymentId }, body: {} };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await paymentControllers.updatePayment(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });

    describe('deletePayment', () => {
        it('should delete a payment', async () => {
            const paymentId = new mongoose.Types.ObjectId();
            const deletedPayment = { _id: paymentId };

            sandbox.stub(Payment, 'findByIdAndDelete').resolves(deletedPayment);

            const req = { params: { id: paymentId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await paymentControllers.deletePayment(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should return 404 when payment not found for deletion', async () => {
            const paymentId = new mongoose.Types.ObjectId();

            sandbox.stub(Payment, 'findByIdAndDelete').resolves(null);

            const req = { params: { id: paymentId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await paymentControllers.deletePayment(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });
});
