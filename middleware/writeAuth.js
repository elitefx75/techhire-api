const requireLoginForWrites = (req, res, next) => {
    const writeMethods = ["POST", "PUT", "PATCH", "DELETE"];

    if (!writeMethods.includes(req.method)) {
        return next();
    }

    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({
        success: false,
        message: "Please login to perform this operation"
    });
};

module.exports = {
    requireLoginForWrites
};