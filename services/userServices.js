const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const registerUser = async (username, email, password, role, res) => {
    if (!username || !email || !password || !role) {
        throw new Error("All fields are mandatory!");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        // Render an error page with an alert message
        return res.render('register', { errorMessage: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
    });

    return newUser;
};

const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new Error("All fields are mandatory!");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }
    user.online = true;
    await user.save();

    const accessToken = jwt.sign(
        { user: { id: user._id, username: user.username, email: user.email, role:user.role } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
    );

    return {
        accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role:user.role
        }

    };

};


module.exports = { registerUser, loginUser };
