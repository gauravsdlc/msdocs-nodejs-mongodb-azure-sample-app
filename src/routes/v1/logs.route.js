const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const controller = require('../../modules/points/points.controller');
const router = express.Router();

router.route('/')
        .get(auth("manageOrg"), controller.getLogs);
router.route('/:organizationId')
        .get(auth("manageAdmin"), controller.getLogs);
module.exports = router;