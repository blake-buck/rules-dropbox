const {emailInterface} = require('../interface/index');

module.exports = {
    sendEmail: function(emailAddress, emailContent){
        console.log('SENDING EMAIL', emailAddress)
        emailInterface.sendEmail(emailAddress, emailContent);
    }
}