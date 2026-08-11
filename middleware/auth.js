const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    if (req.accepts('html')) {
        return res.redirect('/login');
    }

    return res.status(401).json({
        message: 'Your logged out, login first'
    });
};

module.exports = {
    ensureAuthenticated
};
