const asyncHandler = require('express-async-handler');
const { registerUser, loginUser } = require('../services/userServices');
const User = require('../models/userModel');

const userRegister = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;
    console.log('Register request received:', req.body);

    try {
        const newUser = await registerUser(username, email, password, role, res);

        // Send JSON response with user details on success
        res.redirect('/login').status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        });
    } catch (error) {
        console.error('Error registering user:', error.message);

        // Send JSON error message for API response
        res.status(400).json({ message: error.message });
    }
});


const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const {accessToken , user} = await loginUser(email, password);

        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60 * 1000 // 30 minutes
        });
        if (user.role === 'manager') {
            res.redirect('/manager');
            console.log(user.role,"role")
        } else {
            res.redirect(`/employee/${user.id}`);
        }


    } catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(401).json({ message: error.message });
    }
});

const Userlogout = async (req, res) => {
    try {
        // Check if req.user is defined
        if (!req.user || !req.user.userId) {
            console.error('User is not authenticated');
            return res.status(401).json({ message: 'User is not authenticated' });
        }

        // Find the logged-in user and set them as offline
        const user = await User.findById(req.user.userId);
        if (user) {
            user.online = false; // Set the user's status to offline
            await user.save();
            console.log('loged out')   // Save the change to the database
        }

        // Clear the user's session and redirect to login page
        res.clearCookie('token', { path: '/' });
        res.redirect('/login');

    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Error logging out user' });
    }
};





module.exports = {
    userRegister,
    userLogin,
    Userlogout
};
