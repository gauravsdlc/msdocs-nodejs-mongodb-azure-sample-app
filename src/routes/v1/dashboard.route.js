const express = require('express');
const auth = require('../../middlewares/auth');

const dashboardController = require('../../modules/dashboard/controller.dashboard');


const router = express.Router();


router.route("/")
    .get(auth("manageAdmin"),dashboardController.getDashboardData)
module.exports = router;