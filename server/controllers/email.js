const {emailInterface} = require('../models/index');

module.exports = {
    sendEmail: function(emailAddress, emailContent){
        emailInterface.sendEmail(emailAddress, emailContent);
    }
}