const express = require('express');
const auth = require('../../middlewares/auth');

const globalConfigController = require('../../modules/globalConfig/controller/index');


const router = express.Router();



router.route('/updateGlobalConfig/:_id')
    .put(auth("manageAdmin"),globalConfigController.updateGlobalConfig);

router.route('/rate')
    .get(globalConfigController.getRate)
    .post(auth("manageAdmin"), globalConfigController.updateRate);

router.route("/")
    // .post(globalConfigController.addGlobalConfig)
    .get(auth("manageAdmin"),globalConfigController.getGlobalConfig)
module.exports = router;