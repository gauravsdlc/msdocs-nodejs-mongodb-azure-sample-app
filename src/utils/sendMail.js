/* eslint-disable no-console */
const sendGridEmail = require('@sendgrid/mail')
sendGridEmail.setApiKey(process.env.SENDGRID_API_KEY)
const path = require("path");
const mustache = require("mustache");
const fs = require("fs");
const moment = require('moment');



async function sendMail({ to, subject, html, from = process.env.EMAIL_FROM }) {
    
}



async function sendWelcomeMail(addResult, token) {
//   const templateData = {
//     userEmail: addResult.email,
//     temporaryPassword: 'tempPassword123',
//     websiteURL: 'https://yourwebsite.com',
//     supportEmail: 'support@yourorganization.com',
//     supportPhoneNumber: '+1 123-456-7890',
//     yourName: 'Your Name',
//     yourTitle: 'Your Title',
//     yourOrganizationName: 'Your Organization',
//     contactInformation: 'Your Contact Information',
// };
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      "index.html"
    )
  
    const view = {
      orgName: addResult.name,
      organizationId:addResult.organizationId,
      currentYear: moment().year(),
      setPasswordToken:token,
      api_base_url:process.env.API_BASE_URL,
      setPasswordLink: process.env.BASE_URL + `/set-password?email=${addResult.email}&organizationId=${addResult.organizationId}&token=` + token
      
    }
  
    const htmlContent = mustache.render(
      fs.readFileSync(templatePath, "utf8"), view
    );
  
    const mailOptions = {
      from: process.env.SENDGRID_FROM,
      to: addResult.email,
      subject: "Welcome to Fils",
      html: htmlContent,
    };
  console.log("-------------MailOptions------------", {
      from: process.env.SENDGRID_FROM,
      to: addResult.email,
      subject: "Welcome to Fils",
  });
    sendGridEmail
    .send(mailOptions)
    .then(() => {
        console.log('Email sent successfully', addResult.email);
    })
    .catch((error) => {
        console.error('Error sending email:', error.response.body);
    });
    
}
module.exports = {sendWelcomeMail};
