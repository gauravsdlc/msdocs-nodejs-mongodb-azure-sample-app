const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const overviewValidation = require('../../modules/overview/overview.validation.js');
const overviewController = require('../../modules/overview/controller.overview.js');


const router = express.Router();

router.route("/:orgId")
    .get(auth("manageUsers"),validate(overviewValidation.getOverviewByOrgId),overviewController.getOverviewDataForOrg)
    
module.exports = router;