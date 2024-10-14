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

module.exports = {
    getAllUsers
};
