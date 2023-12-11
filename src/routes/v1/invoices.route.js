const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reportValidation = require('../../modules/reporting/report.validation.js');

const reportingController = require('../../modules/reporting/controller.reporting.js');


const router = express.Router();


router.route("/")
    .get(validate(reportValidation.getReportList), reportingController.getReports)
    .post(validate(reportValidation.createReport), reportingController.createReportingData);
router.route("/unpaidReports")
    .get(validate(reportValidation.getReportList), reportingController.unPaidReports)
router.route("/paidReports")
    .get(validate(reportValidation.getReportList), reportingController.getPaidReports)
router.route("/pastDueReports")
    .get(validate(reportValidation.getReportList), reportingController.pastDueReports)

router.route("/:id")
    .get(validate(reportValidation.getReportById), reportingController.getReportById)
    .delete(validate(reportValidation.getReportById), reportingController.deleteReport)
// .put(reportingController.getReportingData)
module.exports = router;