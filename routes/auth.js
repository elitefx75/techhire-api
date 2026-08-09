const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({ message: 'Auth routes are available' });
});

router.post('/register', (req, res) => {
    res.status(501).json({ message: 'Auth registration is not implemented yet' });
});

router.post('/login', (req, res) => {
    res.status(501).json({ message: 'Auth login is not implemented yet' });
});

module.exports = router;
