// backend/app.js
const express = require('express');
require('dotenv').config();  // Add this line at the top
const PORT = process.env.PORT || 8000;
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { ValidationError } = require('sequelize');
const { environment } = require('./config');
const isProduction = environment === 'production';
const app = express();

// Security Middleware
// 1. Set up helmet for security headers before routes
app.use(helmet());

// 2. CORS only in development mode
if (!isProduction) {
  app.use(cors());
}

// 3. Set up cookie-parser before csrf protection
app.use(cookieParser());

// 4. CSRF protection after cookie-parser
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

// Body parser middleware for JSON
app.use(express.json());

// Logger middleware
app.use(morgan('dev'));

// Define all your routes
app.use(routes);

// Catch unhandled requests (404 handler)
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

// app.listen(PORT)

//for testing
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
