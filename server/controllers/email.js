const {emailInterface} = require('../interface/index');

module.exports = {
    sendEmail: function(emailAddress, emailContent){
        emailInterface.sendEmail(emailAddress, emailContent);
    }
}