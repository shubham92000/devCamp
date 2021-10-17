const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
// const logger = require('./middleware/logger');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// load env vars
dotenv.config({ path:'./config/config.env' });

//connect to database
connectDB();

// route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

//body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// app.use(logger);
// dev logging middleware
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}


// mount routers
app.use('/api/v1/bootcamps' , bootcamps);
app.use('/api/v1/courses' , courses);
app.use('/api/v1/auth' , auth);
app.use('/api/v1/users' , users);
app.use('/api/v1/reviews' , reviews);
app.use(errorHandler);

// file uploading
app.use(fileupload());

// sanitize data
app.use(mongoSanitize());

// set static folder
app.use(express.static(path.join(__dirname,'public')));


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT , () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// handle unhandled promise rejections
process.on('unhandledRejection' , (err , promise) => {
  console.log(`Error : ${err.message}`.red);
  // close server and exit process
  server.close(() => process.exit(1));
})