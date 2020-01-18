const {emailInterface} = require('../interface/index');

module.exports = {
    sendEmail: function(emailAddress, emailContent){
        console.log('SENDING EMAIL')
        emailInterface.sendEmail();
    }
}