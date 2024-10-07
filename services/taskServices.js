// services/taskService.js
const mongoose = require('mongoose');

const Task = require('../models/taskModel');

const createTask = async ({ taskName, taskDate, description, assignTo, status,createdBy }) => {
    try {
        const task = new Task({
            title: taskName,         
            date: taskDate,          
            description,             
            assignedTo: assignTo,    
            status  ,createdBy
        });
    
        return await task.save();
    } catch (err) {
        console.error('Error in task service:', err);
        throw err;
    }
};

const updateTask = async (taskId, { title, description, taskDate, assignTo, taskStatus }) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            throw new Error('Invalid taskId format');
        }


        const date = new Date(taskDate);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid taskDate');
        }

        return await Task.findByIdAndUpdate(taskId, {
            title,
            description,
            date,
            assignedTo: assignTo,
            status: taskStatus 
        }, { new: true });
    } catch (err) {
        console.error('Error updating task in task service:', err);
        throw err;
    }
};

// Delete a task
const deleteTask = async (taskId) => {
    try {
        return await Task.findByIdAndDelete(taskId);
    } catch (err) {
        console.error('Error deleting task in task service:', err);
        throw err;
    }
};

const updateTaskStatus = async (taskId, status) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
        if (!updatedTask) {
            throw new Error('Task not found');
        }
        return updatedTask;
    } catch (error) {
        throw new Error(error.message);
    }
};
const getTasksByStatus = async () => {
    try {
        const tasks = await Task.find({});

        const todoTasks = tasks.filter(task => task.status === 'To Do');
        const pendingTasks = tasks.filter(task => task.status === 'Pending');
        const completedTasks = tasks.filter(task => task.status === 'Completed');

        return { todoTasks, pendingTasks, completedTasks };
    } catch (error) {
        throw new Error('Error fetching tasks by status');
    }
};


module.exports = {
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksByStatus
};

