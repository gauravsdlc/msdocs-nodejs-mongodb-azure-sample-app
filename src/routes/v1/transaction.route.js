const express = require('express');
const auth = require('../../middlewares/auth');
const controller = require('../../modules/transaction/controller/index');
const router = express.Router();

router.route('/')
        .get(auth("manageOrg"), controller.getTransaction);

router.route('/:id')
        .get(auth("manageOrg"), controller.getSingleTransaction);

module.exports = router;