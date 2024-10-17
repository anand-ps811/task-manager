require('dotenv').config();
const express = require('express');
const socketIo = require('socket.io');
const path = require('path');
const http = require('http');
const User = require('./models/userModel');
const Group = require('./models/groupModel');
const Message = require('./models/messageModel');
const connectDB = require('./config/dbConnection');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const viewRoute = require('./routes/viewRoute');
const userRoute = require('./routes/userRoute');
const taskRoute = require('./routes/taskRoute');

// Connect to the database
connectDB();

const app = express();
const server = http.createServer(app); // Attach HTTP server
const io = socketIo(server); // Attach socket.io to the HTTP server

require('./socket/chat')(io); // Import and pass io to the chat module

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/user', userRoute);
app.use('/tasks', taskRoute);
app.use('/', viewRoute);

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).render('error', {
        message: 'Page Not Found',
        statusCode: 404
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Error stack:", err.stack); // Log error stack trace for debugging
    res.status(err.status || 500).render('error', {
        message: err.message || 'An unexpected error occurred!',
        statusCode: err.status || 500
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0',() => {
    console.log(`Server started on port: ${PORT}`);
});
