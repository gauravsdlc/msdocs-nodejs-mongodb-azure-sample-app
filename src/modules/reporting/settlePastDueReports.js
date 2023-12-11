//function to change report status from pending to past due
 const  settlePastDueReports = async () => {
    let currDate=new Date()
    const fetchResult = await Report.updateMany({active:true,status:0,dueDate:{$lt:(currDate)}}, {status:2});
    return fetchResult;
    // console.log("my date 2")
}
//timeout for past due reports
// setInterval(settlePastDueReports,1000*60*60*24)

module.exports = {settlePastDueReports};