const asyncHandler = require('express-async-handler');
const { registerUser, loginUser } = require('../services/userServices');

const userRegister = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;
    console.log('Register request received:', req.body);

    try {
        const newUser = await registerUser(username, email, password, role);
        res.redirect('/login').status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        });
    } catch (error) {
        console.error('Error registering user:', error.message);
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

module.exports = {
    userRegister,
    userLogin
};
