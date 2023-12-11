const logger = require('../config/logger');
// var html_to_pdf = require('html-pdf-node');
const sendGridEmail = require('@sendgrid/mail')
sendGridEmail.setApiKey(process.env.SENDGRID_API_KEY)
const REMOTE_URL_BASE_URL = process.env.BASE_URL || "https://qa-fils-app.corpsdlc.com"
const fs = require('fs')
const path = require('path');
const { log } = require('console');


// /* istanbul ignore next */
// if (process.env.NODE_ENV !== 'test') {
//   transport
//     .verify()
//     .then(() => logger.info('Connected to email server'))
//     .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
// }

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail =  (to, subject, text) => {

  const mailOptions = {
    from: process.env.SENDGRID_FROM,
    to: to,
    subject: subject,
    html: text,
  };

  sendGridEmail
  .send(mailOptions)
  .then(() => {
      console.log('Email sent successfully', addResult.email);
  })
  .catch((error) => {
      console.error('Error sending email:', error.response);
  });


  // transport.sendMail(msg, (error, info) => {
  //   if (error) {
  //     console.error("Error sending email:", error);
  //   } else {
  //     console.log("Email sent successfully", info);
  //   }
  // });
};

/**
 * 
 * @param {String} to 
 * @param {String} subject 
 * @param {HtmlString} emailContent 
 */
function sendHtmlMail(to, subject, emailContent) {
    try {
      const msg = { from: process.env.NODE_MAILER_EMAIL, to, subject, html:emailContent };
      transport.sendMail(msg);
    } catch (error) {
      console.log('err while mail sending ... ', error.message);
    }
}

/**
 * 
 * @param {String} to 
 * @param {String} subject 
 * @param {HtmlString} emailContent 
 */
 function sendHtmlAttachmentMail(to, subject, emailContent, attachmentFileName="attachment.pdf") {
  try {
    // const msg = { from: process.env.NODE_MAILER_EMAIL, to, subject, html:emailContent };
    let options = { format: 'A4' };
    // Example of options with args //
    // let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

    let file = { content: emailContent, name: attachmentFileName };
    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
      // console.log("PDF Buffer:-", pdfBuffer);
    
      const msg  = {
        from: process.env.NODE_MAILER_EMAIL,
        to:  to,
        subject: subject,
        text: "this is some test",
        html: emailContent,
        attachments: [{
          filename: attachmentFileName,
            path: pdfBuffer
        }]
      }
      transport.sendMail(msg);
    });
  } catch (error) {
    console.log('err while mail sending ... ', error.message);
  }
}


/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${REMOTE_URL_BASE_URL}/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  sendEmail(to, subject, text);
};

const EmailTemplateTypes = {
  ONBOARDING: 'onboarding',
  EMAIL_VERIFICATION: 'emailVerification',
  SELL_NFT: 'sellNft',
  PURCHASE_NFT: 'purchaseNft',
  RESET_PASSWORD: 'resetPassword',
  SET_PASSWORD: 'setPassword',
  TRANSACTION_INITIATED: 'transactionInitiated',
}

function getOnboardingEmailBody(data) {
  let template = fs.readFileSync(path.resolve(__dirname, '../templates/onboarding.html'))
  template = template.toString('utf-8')
  template = template.replace(new RegExp(`\\[name\\]`, "g"), data.name);
  return template;
}
function getEmailVerificationEmailBody(data) {
  let template = fs.readFileSync(path.resolve(__dirname, '../templates/emailVerification.html'))
  template = template.toString('utf-8')
  template = template.replace(new RegExp(`\\[name\\]`, "g"), data.name);
  template = template.replace(new RegExp(`\\[link\\]`, "g"), data.link);
  return template;
}
function getTransactionInitiatedEmailBody(data) {
  let template = fs.readFileSync(path.resolve(__dirname, '../templates/transactionInitiated.html'))
  template = template.toString('utf-8')
  template = template.replace(new RegExp(`\\[name\\]`, "g"), data.name);
  template = template.replace(new RegExp(`\\[item\\]`, "g"), data.item);
  return template;
}
function getSellNftEmailBody(data) {
  let template = fs.readFileSync(path.resolve(__dirname, '../templates/sellNft.html'))
  template = template.toString('utf-8')
  template = template.replace(new RegExp(`\\[name\\]`, "g"), data.name);
  template = template.replace(new RegExp(`\\[item\\]`, "g"), data.item);
  return template;
}
function getPurchaseNftEmailBody(data) {
  let template = fs.readFileSync(path.resolve(__dirname, '../templates/purchaseNft.html'))
  template = template.toString('utf-8')
  template = template.replace(new RegExp(`\\[name\\]`, "g"), data.name);
  template = template.replace(new RegExp(`\\[item\\]`, "g"), data.item);
  return template;
}
function getResetPasswordEmailBody(data) {
  let template = fs.readFileSync(path.resolve(__dirname, '../templates/resetPassword.html'))
  template = template.toString('utf-8')
  template = template.replace(new RegExp(`\\[name\\]`, "g"), data.name);
  template = template.replace(new RegExp(`\\[link\\]`, "g"), data.link);
  return template;
}
function getSetPasswordEmailBody(data) {
  let template = fs.readFileSync(path.resolve(__dirname, '../templates/setPassword.html'))
  template = template.toString('utf-8')
  template = template.replace(new RegExp(`\\[name\\]`, "g"), data.name);
  template = template.replace(new RegExp(`\\[link\\]`, "g"), data.link);
  return template;
}
function getEmailBodyFromTemplate(templateName, data) {
  switch (templateName) {
    case EmailTemplateTypes.ONBOARDING: return getOnboardingEmailBody(data)
    case EmailTemplateTypes.EMAIL_VERIFICATION: return getEmailVerificationEmailBody(data)
    case EmailTemplateTypes.SELL_NFT: return getSellNftEmailBody(data)
    case EmailTemplateTypes.PURCHASE_NFT: return getPurchaseNftEmailBody(data)
    case EmailTemplateTypes.RESET_PASSWORD: return getResetPasswordEmailBody(data)
    case EmailTemplateTypes.SET_PASSWORD: return getSetPasswordEmailBody(data)
    case EmailTemplateTypes.TRANSACTION_INITIATED: return getTransactionInitiatedEmailBody(data)
  }
}

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendHtmlMail,
  sendHtmlAttachmentMail,
  getEmailBodyFromTemplate,
  EmailTemplateTypes
};
