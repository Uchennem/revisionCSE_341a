const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')
const express = require('express');
const app = express();
const { auth, requiresAuth } = require('express-openid-connect');
const { initDb } = require('./mongoDB/mongodb.js')
const router = require('./routes/index.js')
const utilities = require('./utilities/index.js')

// The connection port localhost or onrender
const port = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.json());

/***** 
 * Authentification block
 * *******/

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: `https://${process.env.ISSUER_BASE_URL}`,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Add support for CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
  });

  initDb((err) => {
    if (err) {
        console.error('Error initializing MongoDB:', err);
    } else {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});

app.use('/', utilities.handleErrors(router));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err); // Passes the error to the next middleware
});


app.use(async (err, req, res, next) => {
  // Log the error along with the request URL to the console.
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  // Determine the message to be displayed based on the error status.
  let message;
  if (err.status == 404) {
    message = `${err.message}  'Do' or 'Do not', there is no trying a different route`;
  } else if (err.status == 500) { 
    message = 'This error is, was, and always will be intentional!';
  } else {
    message = "Oh no! There was a crash. Please route try different";
  }
  console.log(`error: ${message}`);
  // Render the error page with the appropriate title, message, and navigation data.
  res.status(err.status || 500).json({ error: message });
});
