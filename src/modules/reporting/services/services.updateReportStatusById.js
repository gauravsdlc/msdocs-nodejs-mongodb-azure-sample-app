const mongoose = require('mongoose');
const Report = require('../reporting.model');
const Points = require('../../points/points.model');
const { getAllPointsByQuery } = require('../../points/points.service');

const updateReportStatusById = async (id, body, orgId) => {
    var filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) };
    if (orgId) {
        filterQuery = { ...filterQuery, createdBy: (orgId) };
    }
    // update points table
    let report = await Report.findOne(filterQuery, {pointsArray:1,_id:0});
    if(report && report.pointsArray){
        report= report.pointsArray.map((item)=>{return (item._id)})
        const points= await Points.updateMany({active:true,_id:{$in:report}},{invoiceGenerated:true,status:1})
    }else {return null}

    console.log("data",report);

    const fetchResult = await Report.findOneAndUpdate(filterQuery, body);
    return fetchResult;
}
module.exports = updateReportStatusById;