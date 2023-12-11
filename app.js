/* eslint-disable no-console */
const mongoose = require('mongoose');
const app = require('./src/app');
const populateAllEnv  = require('./config/populateAllEnv');
const logger = require('./src/config/logger');
const {settlePastDueReports} = require("./src/modules/reporting/settlePastDueReports");
const checkPointsStatus = require('./src/modules/points/checkPointsStatus');

let server;
let io;




/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

async function getApp() {
  console.log("**Populating ENV**");
  



  mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    logger.info('Connected to MongoDB');
  });

  var port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  return app
}

module.exports = {
  getApp
};




// ----------------------------------------Old-------------------------------------------------------
// var createError = require("http-errors");
// var express = require("express");
// var mongoose = require("mongoose");
// var path = require("path");
// var cookieParser = require("cookie-parser");
// var logger = require("morgan");
// const { format } = require("date-fns");

// // 1st party dependencies
// var configData = require("./config/connection");
// var indexRouter = require("./routes/index");

// async function getApp() {

//   // Database
//   var connectionInfo = await configData.getConnectionInfo();
//   mongoose.connect(connectionInfo.DATABASE_URL);

//   var app = express();

//   var port = normalizePort(process.env.PORT || '3000');
//   app.set('port', port);

//   // view engine setup
//   app.set("views", path.join(__dirname, "views"));
//   app.set("view engine", "pug");

//   app.use(logger("dev"));
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: false }));
//   app.use(cookieParser());
//   app.use(express.static(path.join(__dirname, "public")));

//   app.locals.format = format;

//   app.use("/", indexRouter);
//   app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")); // redirect bootstrap JS
//   app.use(
//     "/css",
//     express.static(__dirname + "/node_modules/bootstrap/dist/css")
//   ); // redirect CSS bootstrap

//   // catch 404 and forward to error handler
//   app.use(function (req, res, next) {
//     next(createError(404));
//   });

//   // error handler
//   app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get("env") === "development" ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render("error");
//   });

//   return app;
// }
// /**
//  * Normalize a port into a number, string, or false.
//  */

//  function normalizePort(val) {
//   var port = parseInt(val, 10);

//   if (isNaN(port)) {
//     // named pipe
//     return val;
//   }

//   if (port >= 0) {
//     // port number
//     return port;
//   }

//   return false;
// }
// module.exports = {
//   getApp
// };
