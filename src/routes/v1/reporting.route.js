const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reportValidation = require('../../modules/reporting/report.validation.js');

const reportingController = require('../../modules/reporting/controller/index');
const Report = require('../../modules/reporting/reporting.model');


const router = express.Router();

//for org admin
router.route("/")
    .get(auth("manageOrg"),validate(reportValidation.getMyReportList),reportingController.getMyReports)
    .post(auth("manageOrg"),validate(reportValidation.createOrgReport), reportingController.createReport);
router.route("/unpaidReports")
    .get(auth("manageOrg"),validate(reportValidation.getReportList), reportingController.myUnPaidReports)
router.route("/received")
    .get(auth("manageOrg"),validate(reportValidation.getReportList), reportingController.receivedReports)
router.route("/sent")
    .get(auth("manageOrg"),validate(reportValidation.getReportList), reportingController.sentReports)
router.route("/paidReports")
    .get(auth("manageOrg"),validate(reportValidation.getReportList), reportingController.getMyPaidReports)
router.route("/pastDueReports")
    .get(auth("manageOrg"),validate(reportValidation.getReportList), reportingController.myPastDueReports)

router.route("/myReport/:id")
    .get(auth("manageOrg"),validate(reportValidation.getReportById), reportingController.getMyReportById)
    .delete(auth("manageOrg"),validate(reportValidation.getReportById), reportingController.deleteMyReport)
    .put(auth("manageOrg"),validate(reportValidation.updateReportById),reportingController.updateMyReportById)

//for super admin
router.route("/admin/")
    .get(auth("manageAdmin"),validate(reportValidation.getReportList), reportingController.getReports)
    .post(auth("manageAdmin"),validate(reportValidation.createReport), reportingController.createReportingData);
router.route("/admin/unpaidReports")
    .get(auth("manageAdmin"),validate(reportValidation.getReportList), reportingController.unPaidReports)
router.route("/admin/paidReports")
    .get(auth("manageAdmin"),validate(reportValidation.getReportList), reportingController.getPaidReports)
router.route("/admin/pastDueReports")
    .get(auth("manageAdmin"),validate(reportValidation.getReportList), reportingController.pastDueReports)
router.route("/admin/received")
    .get(auth("manageAdmin"),validate(reportValidation.getReportList), reportingController.receivedReports)
router.route("/admin/sent")
    .get(auth("manageAdmin"),validate(reportValidation.getReportList), reportingController.sentReports)


router.route("/:id")
    .get(auth("manageAdmin"),validate(reportValidation.getReportById), reportingController.getReportById)
    .delete(auth("manageAdmin"),validate(reportValidation.getReportById), reportingController.deleteReport)
    .put(auth("manageUsers"),validate(reportValidation.updateReportById),reportingController.updateReportById)
router.route("/initiatePayment/:id")
    .put(auth("manageUsers"),validate(reportValidation.getReportById),reportingController.initiatePaymentById)
module.exports = router;

