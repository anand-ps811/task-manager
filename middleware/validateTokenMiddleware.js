const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const validateToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(403).json({ message: 'Invalid token' });
            }

            // Check if decoded is defined before accessing properties
            if (decoded && decoded.user) {
                req.user = {
                    userId: decoded.user.id,
                    role: decoded.user.role,
                    username: decoded.user.username,
                }; // Set the user in the request object
                next(); // Proceed to the next middleware or route handler
            } else {
                return res.status(401).json({ message: 'User not authenticated' });
            }
        });
    } else {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
};

module.exports = validateToken;
