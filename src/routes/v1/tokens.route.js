const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tokensController = require('../../modules/tokens/controller/index')
const tokensValidation = require('../../modules/tokens/tokens.validation.js');

const router = express.Router();
router.route('/myTokenBalance')
    .get(auth('manageOrg'),tokensController.getMyTokens)
//for super admin
router.route('/')
    .post(auth('manageAdmin'),validate(tokensValidation.createTokens),tokensController.createToken)

router.route('/:orgId')
    .get(auth('manageAdmin'),validate(tokensValidation.getTokensById),tokensController.listTokens)
router.route('/totalTokenBalance/:orgId')
    .get(auth('manageAdmin'),validate(tokensValidation.getTokensById),tokensController.getTotalTokens)
router.route('/getTokenHistoryByOrgId/:orgId')
    .get(auth('manageAdmin'),validate(tokensValidation.getTokenHistoryByOrgId),tokensController.getTokenHistoryByOrgId)

module.exports = router;
