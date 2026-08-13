# Unit Tests for TechHire API

This directory contains comprehensive unit tests for the TechHire API endpoints and controllers.

## Structure

```
tests/
├── setup.js              # Test setup and utilities
├── booking.test.js       # Booking controller tests
├── equipment.test.js     # Equipment controller tests
├── payment.test.js       # Payment controller tests
├── review.test.js        # Review controller tests
└── README.md            # This file
```

## Installation

Install test dependencies:

```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Run a specific test file
```bash
npx mocha tests/booking.test.js
```

### Run tests with coverage (requires nyc)
```bash
npm install --save-dev nyc
npx nyc npm test
```

## Test Coverage

Each test file includes comprehensive tests for:

### Booking Controller
- ✅ `getBookings()` - Fetch all bookings
- ✅ `createBooking()` - Create new booking
- ✅ `updateBooking()` - Update existing booking
- ✅ `deleteBooking()` - Delete booking
- ✅ Error handling for each operation

### Equipment Controller
- ✅ `getEquipment()` - Fetch all equipment
- ✅ `getEquipmentById()` - Fetch single equipment
- ✅ `createEquipment()` - Create new equipment
- ✅ `updateEquipment()` - Update equipment
- ✅ `deleteEquipment()` - Delete equipment
- ✅ Error handling for each operation

### Payment Controller
- ✅ `getPayments()` - Fetch all payments
- ✅ `getPaymentById()` - Fetch single payment
- ✅ `createPayment()` - Create new payment with validation
- ✅ `updatePayment()` - Update payment status
- ✅ `deletePayment()` - Delete payment
- ✅ Validation tests for required fields

### Review Controller
- ✅ `getReviews()` - Fetch all reviews
- ✅ `getReviewById()` - Fetch single review
- ✅ `createReview()` - Create review with rating validation
- ✅ `updateReview()` - Update review
- ✅ `deleteReview()` - Delete review
- ✅ Rating range validation (1-5)

## Testing Tools

- **Mocha** - Test runner and framework
- **Chai** - Assertion library
- **Sinon** - Test stubs, mocks, and spies
- **Supertest** - HTTP assertion library (for integration tests)

## Writing New Tests

### Example Test Structure

```javascript
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

// Import controller
const controller = require('../controllers/controller');
const Model = require('../models/model');

describe('Controller Name', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('methodName', () => {
        it('should do something', async () => {
            // Arrange
            const mockData = { /* ... */ };
            sandbox.stub(Model, 'find').resolves(mockData);

            // Act
            const req = { /* ... */ };
            const res = { status: sandbox.stub().returns({ json: sandbox.stub() }) };
            await controller.methodName(req, res);

            // Assert
            expect(res.status.calledWith(200)).to.be.true;
        });
    });
});
```

## Best Practices

1. **Use Sinon for mocking** - Mock database calls with `sinon.stub()`
2. **Test error cases** - Include tests for 400, 404, 500 responses
3. **Use beforeEach/afterEach** - Clean up stubs after each test
4. **Test validation** - Verify required fields and data validation
5. **Keep tests isolated** - Each test should be independent

## Continuous Integration

To add these tests to your CI/CD pipeline:

### GitHub Actions Example
```yaml
- name: Run tests
  run: npm test
```

### GitLab CI Example
```yaml
test:
  script:
    - npm install
    - npm test
```

## Troubleshooting

### Tests not running
- Ensure `node_modules` is installed: `npm install`
- Check `.mocharc.json` configuration

### Stub errors
- Make sure to use `sandbox.restore()` in `afterEach()`
- Verify the correct model/function is being stubbed

### Database connection issues
- Tests use database mocks, not real connections
- If you need real DB tests, modify test setup to connect to MongoDB

## Next Steps

1. Add integration tests using Supertest
2. Add end-to-end tests for API routes
3. Set up coverage reporting with nyc
4. Add tests to your CI/CD pipeline
5. Aim for 80%+ code coverage
