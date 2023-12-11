const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const controller = require('../../modules/webhooks/controller');


const router = express.Router();


router.route("/")
    .post(auth('manageOrg'), controller.addWebhook)
    .get(auth('manageOrg'), controller.getWebhooks)
router.route("/:orgId")
    .get(auth('manageAdmin'), controller.getWebhooksByOrgId)
router.route("/:id")
    .delete(auth('manageOrg'), controller.removeWebhookById
    )

module.exports = router;