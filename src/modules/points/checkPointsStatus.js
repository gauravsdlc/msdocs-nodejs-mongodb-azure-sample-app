
const {
    checkUnsettledPoints
} = require('./points.service')



module.exports = function checkPointsStatus() {
    if (process.env.ENABLE_WEBHOOK_CHECK === "yes") {
        console.log('**Webhook enabled**');
        setInterval(async () => {
            console.log("Checking Points Status...");
            checkUnsettledPoints()
        }, 20000)
    }
}