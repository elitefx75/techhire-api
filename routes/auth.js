const express = require('express');
const passport = require('../config/passport');

const router = express.Router();

// GitHub login
router.get(
    '/github',
    passport.authenticate('github', {
        scope: ['user:email']
    })
);

// GitHub callback
router.get(
    '/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/api/auth/login-failed'
    }),
    (req, res) => {
        const appBaseUrl = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        return res.redirect(appBaseUrl.replace(/\/$/, '') + '/login');
    }
);

// Login failed
router.get('/login-failed', (req, res) => {
    res.status(401).json({
        message: 'GitHub authentication failed'
    });
});

// Current logged-in user
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: 'Not authenticated'
        });
    }

    res.status(200).json({
        user: req.user
    });
});

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }

        req.session.destroy(() => {
            res.status(200).json({
                message: 'Logged out successfully'
            });
        });
    });
});

module.exports = router;