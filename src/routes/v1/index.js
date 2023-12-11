const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const apiKeyRoute = require('./apiKey.route');
const webhooks = require('./webhooks.route');
const docsRoute = require('./docs.route');
const globalConfig = require("./globalConfig.route");
const currencyRoute = require("./currency.route");
const tokenRoute = require("./tokens.route");
const pointsRoute = require("./points.route");
const pointsRoute2 = require("./points.route");
const dashboardRoute = require("./dashboard.route.js");
const overviewRoute = require("./overview.route.js");
const reportingRoute = require("./reporting.route.js");
const logsRoute = require("./logs.route");
const transactionRoute = require("./transaction.route");
const organizations = require('./organizations.route.js');



const { uploadFile } = require('../../utils/fileUpload');
const { totalSupply } = require('../../../scripts/contractUtils');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/router',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  // global config route
  {
    path: '/globalConfig',
    route: globalConfig,
  },
  // currency route
  {
    path: '/currency',
    route: currencyRoute,
  },
  // currency route
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
  // super admin reporting
  {
    path: '/reporting',
    route: reportingRoute,
  },
  {
    path: '/apiKey',
    route: apiKeyRoute,
  },
  {
    path: '/webhooks',
    route: webhooks,
  },
  {
    path: "/logs",
    route: logsRoute
  },
  {
    path: "/transaction",
    route: transactionRoute
  },
  // for orgTokens added by super admin
  {
    path: '/token',
    route: tokenRoute,
  },
  // for getting points
  {
    path: '/public-points',
    route: pointsRoute,
  },
  {
    path: '/points',
    route: pointsRoute2,
  },
  {
    path: '/overview',
    route: overviewRoute,
  },
  {
    path: '/organizations',
    route: organizations,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.route('/upload-file').post(uploadFile);


/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}
// totalSupply();
module.exports = router;
