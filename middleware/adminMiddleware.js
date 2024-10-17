const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        console.error('No token provided'); 
        return res.redirect('/login').status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Correctly declare and assign 'decoded' in one line
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('Decoded token:', decoded);  

        // Attach user information to the request
        req.user = {
            userId: decoded.user.id,
            role: decoded.user.role,
            username: decoded.user.username
        };

        // Check if the user has an 'employee' role
        if (req.user.role === 'manager') {
            next();
        } else {
            res.redirect('/login');  // Redirect if the user doesn't have the right role
        }
    } catch (err) {
        console.error('Token verification failed:', err);
        res.redirect('/login');  
    }
};

module.exports = authMiddleware;
