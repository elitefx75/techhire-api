

const mongoose = require('mongoose');

// Mock MongoDB connection
exports.connectDB = async () => {
    try {
        // Use in-memory MongoDB for testing (if configured)
        // For now, we'll use the actual connection from .env
        if (process.env.MONGODB_URL) {
            await mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }
    } catch (error) {
        console.error('DB Connection Error:', error);
    }
};

exports.disconnectDB = async () => {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.error('DB Disconnection Error:', error);
    }
};

// Mock request and response objects
exports.mockRequest = (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query,
    user: { id: 'test-user-id' }
});

exports.mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// Test data generators
exports.generateTestBooking = () => ({
    userId: new mongoose.Types.ObjectId(),
    equipment: new mongoose.Types.ObjectId(),
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000),
    status: 'pending',
    totalCost: 100
});

exports.generateTestEquipment = () => ({
    name: 'Test Equipment',
    description: 'A test equipment item',
    category: 'electronics',
    dailyRate: 50,
    availabilityStatus: 'available',
    images: ['image1.jpg'],
    owner: new mongoose.Types.ObjectId()
});

exports.generateTestPayment = () => ({
    bookingId: new mongoose.Types.ObjectId(),
    userId: new mongoose.Types.ObjectId(),
    amount: 100,
    paymentMethod: 'credit_card',
    paymentStatus: 'completed',
    transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9)
});

exports.generateTestReview = () => ({
    userId: new mongoose.Types.ObjectId(),
    equipmentId: new mongoose.Types.ObjectId(),
    rating: 4,
    comment: 'Great equipment!'
});
