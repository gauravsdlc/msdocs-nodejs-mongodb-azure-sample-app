const fetch = require('node-fetch')


const webhookAPI = async (url, options) => {
    let response = await fetch(url, options)
    return await response.json()
}

module.exports = {
    webhookAPI
}