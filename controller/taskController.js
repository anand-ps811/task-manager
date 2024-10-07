const taskService = require('../services/taskServices')

const createNewTask = async (req, res) => {
    const { taskName, taskDate, description, assignTo, status } = req.body;
    console.log(req.body);
    if (!taskName || !taskDate || !description || !assignTo || !status) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const { userId} = req.user;
        await taskService.createTask({ taskName, taskDate, description, assignTo, status,createdBy:userId});
        // console.log(res.createdBy,'createTaskBy')
        res.redirect('/manager');
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).send('Server error');
    }
};


const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, taskDate, assignTo, taskStatus } = req.body;

    console.log('Task ID:', taskId);
    console.log('Request Body:', req.body);
    console.log('Assign To:', assignTo);

    try {
        const updatedTask = await taskService.updateTask(taskId, { title, description, taskDate, assignTo, taskStatus });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log("Updated task:", updatedTask);
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error('Error updating task in task controller:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Delete a task
const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const deletedTask = await taskService.deleteTask(taskId);
        if (deletedTask) {
            res.status(200).json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        console.error('Error deleting task in task controller:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const editStatus = async (req, res) => {
    const { id: taskId } = req.params;
    const { status} = req.body; 

    try {
        const updatedTask = await taskService.updateTaskStatus(taskId, status);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).send('Internal Server Error');
    }
};
const checkTaskStatus = async (req, res) => {
    try {
        const { todoTasks, pendingTasks, completedTasks } = await taskService.getTasksByStatus();
        res.render('checkStatus', { todoTasks, pendingTasks, completedTasks });
    } catch (error) {
        res.status(500).send('Error fetching tasks');
    }
};

module.exports = {
    createNewTask,
    updateTask,
    deleteTask,
    editStatus,
    checkTaskStatus
};
