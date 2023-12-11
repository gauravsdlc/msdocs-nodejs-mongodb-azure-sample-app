const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const morgan = require('./config/morgan');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const session = require('express-session');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
// app.use(helmet());

// set security HTTP headers including X-XSS-Protection
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable Content Security Policy if needed
    xssFilter: { setOnOldIE: true }, // Enable XSS Protection
  })
);

// Custom middleware to set X-XSS-Protection header
app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});


// parse json request body
app.use(express.json({ limit: '50mb' }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// Define a list of trusted domains
const allowedDomains = ['http://127.0.0.1:5173', 'https://qa-fils-app.corpsdlc.com'];

// Configure CORS middleware with specific origin options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedDomains.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  credentials: true
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// enable cors
// app.use(cors());
// app.options('*', cors());


// limit repeated failed requests to auth endpoints
if (process.env.NODE_ENV === 'production') {
  app.use('/v1/auth', authLimiter);
}

app.all("/", (req, res) => {
  res.send("Fils API Page");
})

//Middleware
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
}))
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
// jwt authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use('jwt', jwtStrategy);

app.use('/v1', routes);

app.all('/', (req, res) => {
  res.send("Hello from Fils APIs")
});

if (process.env.NODE_ENV === 'production') {
  //? Available only for production
}
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);


module.exports = app;
