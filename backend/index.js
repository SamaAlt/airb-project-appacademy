// backend/index.js


const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { environment } = require('./config');
const isProduction = environment === 'production';
const routes = require('./routes');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Set Content Security Policy header (updated and more permissive code)
app.use((req, res, next) => {
  // Explicitly allow 'localhost:8000' for 'connect-src' and also set 'default-src' to allow basic content
  res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://localhost:8000;");
  next();
});

// Security Middleware
if (!isProduction) {
  app.use(cors()); // Enable CORS in development only
}

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// CSRF protection middleware
app.use(
  csurf({
    cookie: {
      secure: isProduction, // Ensure cookies are secure in production
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

// Set up the routes
app.use(routes);

// Start the server and listen on the specified port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
