const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { nftUsersValidation } = require('../../validations');
const { nftUserController } = require('../../controllers');

const router = express.Router();







module.exports = router;
