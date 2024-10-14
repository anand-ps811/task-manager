const express = require('express');
const userController = require('../controller/userController');
const validateToken= require('../middleware/validateTokenMiddleware')

const router = express.Router();


router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);

router.get('/logout',validateToken , userController.Userlogout);


module.exports = router;
