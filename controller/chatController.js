const chatService = require('../services/chatService');

const renderChatPage = async (req, res) => {
    console.log('render chat page called')
    // Check if user is authenticated
    if (!req.user) {   
        console.log('User not authenticated, redirecting to login');
        return res.redirect('/login');
    }
    
    try {
  // Fetch users who are currently online
  const users = await chatService.getAllUsers();  // Assuming `getOnlineUsers` fetches only online users
  res.render('chat', { 
            username: req.user.username,users // Pass the logged-in username
        });        } catch (error) {
        console.error('Error fetching users:', error);
        res.redirect('/login'); // Redirect if there is an error
    }
};

module.exports = {
    renderChatPage
};
