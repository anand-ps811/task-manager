require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/dbConnection');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Connect to the database
connectDB();

const app = express();

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
app.use('/user', require('./routes/userRoute.js'));
app.use('/tasks', require('./routes/taskRoute.js'));
app.use('/', require('./routes/viewRoute.js'));

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

// Test route to deliberately trigger an error
app.get('/test-error', (req, res, next) => {
    const error = new Error('This is a test error');
    error.status = 500;
    next(error); // Pass the error to the error handling middleware
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
