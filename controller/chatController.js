const chatService = require('../services/chatService');

const renderChatPage = async (req, res) => {
    console.log('render chat page called')
    // Check if user is authenticated
    if (!req.user) {   
        console.log('User not authenticated, redirecting to login');
        return res.redirect('/login');
    }
    
    try {
        const users = await chatService.getAllUsers(); // Fetch all users (if needed)
        res.render('chat', { username: req.user.username }); 
        } catch (error) {
        console.error('Error fetching users:', error);
        res.redirect('/login'); // Redirect if there is an error
    }
};

module.exports = {
    renderChatPage
};
