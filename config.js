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
  }
};
module.exports = config;