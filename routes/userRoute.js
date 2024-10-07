const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();


router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);

router.get('/logout', (req, res) => {
    console.log('Logout request received');
    res.clearCookie('token', { path: '/' });
    res.redirect('/login');

});


module.exports = router;
