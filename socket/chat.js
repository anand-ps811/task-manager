const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const User = require('../models/userModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected with socketID:', socket.id);

        socket.on("user login", async (username) => {
            try {
                const user = await User.findOne({ username });
                if (user) {
                    const updatedUser = await User.findByIdAndUpdate(
                        user._id,
                        { socketId: socket.id, online: true },
                        { new: true }
                    );

                    socket.userId = updatedUser._id;
                    socket.username = updatedUser.username;

                    console.log('User login success:', updatedUser);
                    socket.emit('login success', `Welcome ${updatedUser.username}`);
                } else {
                    socket.emit('login error', 'User not found. Please try again.');
                }
            } catch (error) {
                console.error('Error during user login:', error);
                socket.emit('login error', 'Login failed. Please try again.');
            }
        });

        socket.on('chat message', async (data) => {
            const { sender, receiver, message } = data;
            console.log("Received chat message data:", data);

            try {
                const receiverUser = await User.findOne({ username: receiver });

                if (receiverUser && receiverUser.socketId) {
                    io.to(receiverUser.socketId).emit('chat message', { sender, receiver, message });
                    console.log('Message sent to receiver:', receiverUser.socketId);
                } else {
                    socket.emit('chat message', { sender: 'System', message: 'User is offline or not available.' });
                    console.log('User is offline or not available:', receiver);
                }
            } catch (error) {
                console.error('Error handling chat message:', error);
            }
        });

        socket.on('disconnect', async () => {
            try {
                if (socket.userId) {
                    await User.findByIdAndUpdate(
                        socket.userId,
                        { socketId: null, online: false }
                    );
                    console.log(`User ${socket.username} disconnected and is now offline.`);
                }
            } catch (error) {
                console.error('Error during user disconnect:', error);
            }
        });
    });
};
