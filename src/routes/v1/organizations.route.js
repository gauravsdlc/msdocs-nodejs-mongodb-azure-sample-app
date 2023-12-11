const express = require('express');
const authApiKeyAuth = require('../../middlewares/authApiKey');
const controller = require('../../modules/orgDetails/controller');

const router = express.Router();

router.route('/')
    .get(authApiKeyAuth(), controller.listOrganization);

module.exports = router;