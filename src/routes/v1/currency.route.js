const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const currencyController = require('../../modules/currency/controller/index')
const currencyValidation = require('../../modules/currency/currency.validation.js');
const authApiKeyAuth = require('../../middlewares/authApiKey');

const router = express.Router();
//for org admin
router.route('/myCurrencies')
    .get(auth('manageOrg'),currencyController.myCurrencyList)

//for super admin



router.route('/')
    .get(auth('manageAdmin'),currencyController.listCurrency)
    .post(auth('manageAdmin'),validate(currencyValidation.createCurrency),currencyController.createCurrency)
router.route('/changeCurrencyStatus/:id')
    .put(auth('manageAdmin'),validate(currencyValidation.changeCurrencyStatusById),currencyController.changeCurrencyActivationStatus)
//get only currencies, having inActive:false,active:true
router.route('/listActive')
    .get(auth('manageUsers'),currencyController.listActiveCurrency)
router.route('/:id')
    .get(auth('manageUsers'),validate(currencyValidation.getCurrencyById),currencyController.getCurrencyById)
    .delete(auth('manageUsers'),validate(currencyValidation.getCurrencyById),currencyController.deleteCurrency)
    .put(auth('manageUsers'),validate(currencyValidation.updateCurrencyById),currencyController.changeCurrencyById);
    
router.route('/all')
    .get(authApiKeyAuth(), currencyController.listOrganization);
module.exports = router;
