require('dotenv').config();
const express = require('express');
const socketIo=require('socket.io');
const path = require('path');
const http = require('http');
const connectDB = require('./config/dbConnection');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const viewRoute = require('./routes/viewRoute.js');
const userRoute=require('./routes/userRoute.js');
const taskRoute= require('./routes/taskRoute.js');
// Connect to the database
connectDB();

const app = express();
const server=http.createServer(app);
const io =socketIo(server)


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
app.use(express.static(path.join(__dirname, 'public/css'))); // Adjust the path if necessary

// Routes
app.use('/user', userRoute);
app.use('/tasks',taskRoute);
app.use('/', viewRoute);
// app.use('/chat',require('./routes/chatRoute.js'));

// Catch all non-existing routes (404 error)
app.use((req, res, next) => {
    res.status(404).render('error', {
        message: 'Page Not Found',
        statusCode: 404
    });
});

// Global error-handling middleware for other errors
app.use((err, req, res, next) => {
    console.error("Error stack:", err.stack); // Log the error stack
    res.status(err.status || 500).render('error', {
        message: err.message || 'An unexpected error occurred!',
        statusCode: err.status || 500
    });
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
