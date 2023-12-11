const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const SEND_GRID_FROM = process.env.SENDGRID_FROM;

/**
 * @param {object} brand brand data
 */
// function sendAddBrandEmail(addResult) {
//   const templatePath = path.join(
//     __dirname,
//     "..",
//     "templates",
//     "add_brand.html"
//   )
//   const view = {
//     siteName: "utility.com",
//     supportMail: "admin@utility.com",
//     currentYear: moment().year(),
//   }
// ​
//   const htmlContent = mustache.render(
//     fs.readFileSync(templatePath, "utf8"),
//     view
//   );
//   const mailOptions = {
//     from: "admin@utility.art",
//     to: addResult.email,
//     subject: "Add Brand",
//     html: htmlContent,
//   };
//   transport.sendMail(mailOptions, function (err, info) {
//     if (err) {
//       console.log(err);
//     }
//   });
// }
/**
 * @param {string} to 
 * @param {object} emailBody
 */
const signUpOtpEmail = ({ to, emailBody }) => {

  let templateObj = {
    to,
    from: SEND_GRID_FROM,
    subject: `Your Stardust OTP is ${emailBody}`,
    html: `<!DOCTYPE html>
      <html>
      <head>
      </head>
      <body>
      <p>Hi,</p>
      <p>Your OTP is : <span style="color:blue">${emailBody}</span></p>
      <p style="margin: 0;">Please do not hesitate to contact us if you encounter any problem.</p>
      <p style="margin: 0;"> Look forward to seeing you in our Metaverse.</p>
      </body>
      </html>`,
  };
  sendEmail(templateObj)
}

/**
 * @param {string} to 
 * @param {object} emailBody
 */
const signUpWelcomeEmail = ({ to, emailBody }) => {

  let templateObj = {
    to,
    from: SEND_GRID_FROM,
    subject: `Welcome to Stardust!`,
    // text: body,
    html: `<!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
    <p>Hi ${emailBody.fName} ${emailBody.lName},</p>
    
    <p>Thank you for signing up with Stardust. </p>
    <p>
    Congratulations on becoming a Pioneer Member, the first 5,000 members to join our Metaverse. Look forward to our exclusive virtual Launch Party in Stardust at the end of January 2023, where we will be giving out mystery prizes to honor our Pioneer Members!
    </p>
    <p>We will be sending you more information about our virtual party soon.</p>
    <p>We look forward to seeing you in Stardust… where virtuality meets reality!</p>
    </body>
    </html>`,
  };
  sendEmail(templateObj)
}

/**
 * @param {string} to 
 * @param {object} emailBody
 */
const sendProfileInviteEmail = ({ to, emailBody }) => {
  let templateObj = {
    to,
    from: 'verifiedemail@previousstep.com',
    subject: 'Invitation for profile',
    // text: body,
    html: `<!DOCTYPE html>
      <html>
      <head>
      <style>
      a:link, a:visited {
        background-color: grey;
        color: white;
        padding: 14px 25px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
      }
      
      a:hover, a:active {
        background-color: black;
      }
      </style>
      </head>
      <body>
      
      <h2>Link Button</h2>
      
      <p>A link styled as a button:</p>
      <a href=${emailBody.link} target="_blank">Invitation</a>
      
      </body>
      </html>`,
  };
  sendEmail(templateObj)
}

const philiEventEmail = ({ to, emailBody }) => {

  let templateObj = {
    to,
    from: SEND_GRID_FROM,
    subject: `Welcome to Stardust!`,
    // text: body,
    html: `<!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
    <p>Hi ${emailBody.fName} ${emailBody.lName},</p>
    
    <p>Thank you for signing up with Stardust. </p>
    <p>
    Congratulations on becoming a Pioneer Member, the first 5,000 members to join our Metaverse. Look forward to our exclusive virtual Launch Party in Stardust at the end of January 2023, where we will be giving out mystery prizes to honor our Pioneer Members!
    </p>
    <p>We will be sending you more information about our virtual party soon.</p>
    <p>We look forward to seeing you in Stardust… where virtuality meets reality!</p>
    </body>
    </html>`,
  };
  sendEmail(templateObj)
}

const luckyDrawWinnerEmail = ({ to, emailBody }) => {
  console.log( to );
  let templateObj = {
    to,
    from: SEND_GRID_FROM,
    subject: `Confirmation of Stardust Raffle Draw Prize at Cosplay Matsuri`,
    // text: body,
    html: `<!DOCTYPE html>
    <html>
    <head>
   <style>
ul.a {
  list-style-type: number;
}
li{
	margin-bottom:10px;
}

</style>
    </head>
 
    <body>
    <p>Hi ${emailBody.name},</p>
    
    <p>
Congratulations on winning a plot of Standard LAND (20m x 20m) in the Stardust Metaverse worth USD500!</p>
  
    <ul class="a">
  <li>Kindly claim your prize by providing your Ethereum-based crypto wallet address to us so that we can make the transfer to you. You may apply for a wallet via MetaMask or Trust Wallet if you do not have one.
  </li>
  <li>Once the LAND is transferred to your wallet, it is fully owned by you and under your full responsibility. You may give, transfer or sell it on a secondary market, or build your own building on your LAND as you please.
  </li>
  <li>We will be holding your prize for you up to 10 April 2023. If you do not claim it via the above explained process before the date, your prize will be forfeited.</li>
</ul>
<p>
Please do not hesitate to contact us if you have any queries. We look forward to seeing you in the Metaverse!!
</p>
    </body>
    </html>`,
  };
  sendEmail(templateObj)
}

async function sendEmail(templateObj) {

  try {
    await sendGridMail.send(templateObj);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error Email');
    console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
  }
}
module.exports = {
  signUpOtpEmail,
  signUpWelcomeEmail,
  sendProfileInviteEmail,
  philiEventEmail,
  luckyDrawWinnerEmail
};