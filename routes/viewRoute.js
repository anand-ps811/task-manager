const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const viewController= require('../controller/viewController');
const router = express.Router();

router.get('/', viewController.renderLoginPage);
router.get('/register', viewController.renderRegisterPage);
router.get('/login', viewController.renderLoginPage);
router.get('/employee/:id',authMiddleware,viewController.renderEmployeePage);
router.get('/manager',adminMiddleware,viewController.renderManagerPage);
router.get('/createTask',adminMiddleware,viewController.renderCreateTaskPage);
router.get('/updateTask/:id', adminMiddleware,viewController.renderUpdateTaskPage);
router.get('/editStatus/:id',authMiddleware, viewController.renderEditStatusPage);
router.get('/checkStatus',adminMiddleware,viewController.renderCheckStatusPage)



module.exports = router;


























