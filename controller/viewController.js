const User = require('../models/userModel');
const Task = require('../models/taskModel'); 
const Chat = require('../services/chatService')
const authMiddleware= require('../middleware/authMiddleware')

const renderRegisterPage = (req, res) => {
    res.render('register');
};

const renderLoginPage = (req, res) => {
    res.render('login');
};


const renderEditStatusPage = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const user = await User.findById(task.assignedTo);

        if (!task) {
            return res.status(404).send('Task not found');
        }
        const userId = user ? user._id : null;

        res.render('editStatus', { task, userId ,user}); 
    } catch (error) {
        console.error('Error rendering edit status page:', error);
        res.status(500).send('Server Error');
    }
};
const renderEmployeePage = async (req, res) => {
    try {
        const { userId, role: userRole, username } = req.user;  
        if (!userId) {
            return res.status(400).send('User ID is required');
        }


        const tasks = await Task.find({ assignedTo: userId })
        .populate('createdBy', 'username'); 
        
        res.render('employee', { tasks,userRole,username });

    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Server error');
    }
};



const renderManagerPage = async (req, res) => {
    try {
        const { userId, role: userRole,username } = req.user;  
        
        const tasks = await Task.find()
        .populate('assignedTo', 'username')
        .populate('createdBy', 'username'); 
                res.render('manager', { tasks, userId, userRole,username });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Server Error');
    }
};


const renderCreateTaskPage =async(req,res)=>{
    try{
        const users = await User.find({role:'employee'});
        res.render('createTask',{users})
    }
    catch (err) {
        console.error('Error rendering create task page:', err);
        res.status(500).send('Server Error');
    }
}
const renderUpdateTaskPage = async (req, res) => {
    try {
        const taskId = req.params.id; 
        const task = await Task.findById(taskId); 
        const users = await User.find({role:'employee'}); 
        // const userId = req.user ? req.user._id : null;
    
        const assignedUserId = task.assignedTo ? task.assignedTo._id : null;

        res.render('updateTask', { task , users, assignedUserId}); 


    } catch (err) {
        console.error('Error fetching task:', err);
        // res.status(500).send('Server Error'); server error while delete
    }
};

const renderCheckStatusPage = async (req, res) => {
    try {
        const tasks = await Task.aggregate([
            {
                $project: {
                    title: 1,
                    status: 1 
                }
            },
            {
                $group: {
                    _id: "$status",
                    tasks: {
                        $push: {
                            title: "$title"
                        }
                    }
                }
            }
        ]);

        const groupedTasks = {
            todo: tasks.find(task => task._id === 'To-Do')?.tasks || [],
            pending: tasks.find(task => task._id === 'Pending')?.tasks || [],
            completed: tasks.find(task => task._id === 'Completed')?.tasks || []
        };

        console.log('Grouped tasks by status:', groupedTasks);

        res.render('checkStatus', groupedTasks);
    } catch (error) {
        console.error('Error rendering check status page:', error);
        res.status(500).send('Server Error');
    }
};


module.exports = {
    renderRegisterPage,
    renderLoginPage,
    renderEmployeePage,
    renderManagerPage,
    renderCreateTaskPage,
    renderUpdateTaskPage,
    renderEditStatusPage,
    renderCheckStatusPage,
  
};
