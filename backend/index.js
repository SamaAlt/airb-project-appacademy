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
