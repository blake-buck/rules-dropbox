const {emailModel} = require('../models/index');

module.exports = {
    sendEmail: function(emailAddress, emailContent){
        emailModel.sendEmail(emailAddress, emailContent);
    }
}