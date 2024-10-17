const User = require('../models/userModel');

// Function to fetch all users
const getAllUsers = async () => {
    try {
        return await User.find(); // Return all users from the database
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Propagate the error to be handled in the controller
    }
};
const getOnlineUsers = async () => {
    return User.find({ online: true }).select('username');  // Fetch only online users with their username
};

module.exports = {
    getAllUsers,
    getOnlineUsers
};
