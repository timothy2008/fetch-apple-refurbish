//Follow the instructions in https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1 to create Google API Token
var config = {
  //Require 'Control access to less secure apps' on google account enabled
  mailAccount : {
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com',
      pass: 'your password'
    }
  },
  //if 'Control access to less secure apps' on google account disabled, please fill the following OAuth credential
  mailAccountOAuth : {
    service: "gmail",
    auth: {
         type: "OAuth2",
         user: "youremail@gmail.com", 
         clientId: "your client id",
         clientSecret: "your client secret",
         refreshToken: "your refreshtoken",
         accessToken: "your accesstoken"
    }
  },
  //The mail it sent to
  mailOptions : {
    from: 'youremail@gmail.com',
    to: 'toemail@gmail.com',
    subject: 'Report of Apple refurbished products',
    text: 'That was easy!'
  },
  //networkidle2 timeout value of puppeteer
  networkidletimeout: 30000,
  regex_match_product: /12\.9-inch\ iPad\ Pro/gm,
  b_send_report_only_match: true,
  headless: true,
  viewport: [1920,1080],
  err_retries: 10
};
module.exports = config;