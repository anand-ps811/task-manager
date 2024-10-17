const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const validateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');  // If no token, redirect to login
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification failed:', err);
            return res.redirect('/login');  // Redirect if token verification fails
        }

        // Store the decoded user info in req.user, unique to each user
        req.user = {
            userId: decoded.user.id,
            role: decoded.user.role,
            username: decoded.user.username
        };

        next();  // Proceed to the next middleware/route handler
    });
};

module.exports = validateToken;
