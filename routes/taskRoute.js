const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');
const authMiddleware=require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware');


router.post('/create-task',adminMiddleware, taskController.createNewTask);

router.put('/updateTask/:taskId', adminMiddleware, taskController.updateTask);

router.delete('/deleteTask/:taskId', adminMiddleware, taskController.deleteTask);

router.put('/updateStatus/:id',authMiddleware, taskController.editStatus);

router.get('/checkStatus', adminMiddleware, taskController.checkTaskStatus);


module.exports = router;
 