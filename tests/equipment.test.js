
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

// Import models and controllers
const Equipment = require('../models/equipment');
const equipmentControllers = require('../controllers/equipmentControllers');

describe('Equipment Controller', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getEquipment', () => {
        it('should return all equipment', async () => {
            const mockEquipment = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    name: 'Laptop',
                    category: 'electronics',
                    dailyRate: 50,
                    availabilityStatus: 'available'
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    name: 'Projector',
                    category: 'electronics',
                    dailyRate: 75,
                    availabilityStatus: 'available'
                }
            ];

            sandbox.stub(Equipment, 'find').resolves(mockEquipment);

            const req = {};
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await equipmentControllers.getEquipment(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.status().json.calledWith(mockEquipment)).to.be.true;
        });

        it('should handle errors when fetching equipment', async () => {
            const error = new Error('Database error');
            sandbox.stub(Equipment, 'find').rejects(error);

            const req = {};
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await equipmentControllers.getEquipment(req, res);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    describe('getEquipmentById', () => {
        it('should return a single equipment by ID', async () => {
            const equipmentId = new mongoose.Types.ObjectId();
            const mockEquipment = {
                _id: equipmentId,
                name: 'Laptop',
                category: 'electronics',
                dailyRate: 50
            };

            sandbox.stub(Equipment, 'findById').resolves(mockEquipment);

            const req = { params: { id: equipmentId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await equipmentControllers.getEquipmentById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.status().json.calledWith(mockEquipment)).to.be.true;
        });

        it('should return 404 when equipment not found', async () => {
            const equipmentId = new mongoose.Types.ObjectId();

            sandbox.stub(Equipment, 'findById').resolves(null);

            const req = { params: { id: equipmentId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await equipmentControllers.getEquipmentById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });

    describe('createEquipment', () => {
        it('should create a new equipment', async () => {
            const equipmentData = {
                name: 'New Equipment',
                category: 'tools',
                dailyRate: 100,
                description: 'A new tool'
            };

            const mockEquipment = { _id: new mongoose.Types.ObjectId(), ...equipmentData };

            sandbox.stub(Equipment, 'create').resolves(mockEquipment);

            const req = { body: equipmentData };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await equipmentControllers.createEquipment(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.status().json.called).to.be.true;
        });

        it('should return 400 for invalid equipment data', async () => {
            const error = new Error('Validation error');
            sandbox.stub(Equipment, 'create').rejects(error);

            const req = { body: {} };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await equipmentControllers.createEquipment(req, res);

            expect(res.status.calledWith(400)).to.be.true;
        });
    });

    describe('updateEquipment', () => {
        it('should update existing equipment', async () => {
            const equipmentId = new mongoose.Types.ObjectId();
            const updateData = { dailyRate: 120 };
            const updatedEquipment = { _id: equipmentId, ...updateData };

            sandbox.stub(Equipment, 'findByIdAndUpdate').resolves(updatedEquipment);

            const req = { params: { id: equipmentId }, body: updateData };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await equipmentControllers.updateEquipment(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should return 404 when equipment not found for update', async () => {
            const equipmentId = new mongoose.Types.ObjectId();

            sandbox.stub(Equipment, 'findByIdAndUpdate').resolves(null);

            const req = { params: { id: equipmentId }, body: {} };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await equipmentControllers.updateEquipment(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });

    describe('deleteEquipment', () => {
        it('should delete equipment', async () => {
            const equipmentId = new mongoose.Types.ObjectId();
            const deletedEquipment = { _id: equipmentId };

            sandbox.stub(Equipment, 'findByIdAndDelete').resolves(deletedEquipment);

            const req = { params: { id: equipmentId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await equipmentControllers.deleteEquipment(req, res);

            expect(res.status.calledWith(200)).to.be.true;
        });

        it('should return 404 when equipment not found for deletion', async () => {
            const equipmentId = new mongoose.Types.ObjectId();

            sandbox.stub(Equipment, 'findByIdAndDelete').resolves(null);

            const req = { params: { id: equipmentId } };
            const res = {
                status: sandbox.stub().returns({ json: sandbox.stub() })
            };

            await equipmentControllers.deleteEquipment(req, res);

            expect(res.status.calledWith(404)).to.be.true;
        });
    });
});
