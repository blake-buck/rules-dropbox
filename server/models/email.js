const nodemailer = require('nodemailer');
const {EMAIL} = require('../config/config.js');

let transporter = nodemailer.createTransport({
    service:EMAIL.service,
    auth: {
        user: EMAIL.username,
        pass: EMAIL.password
    }
})

module.exports = {
    sendEmail: async function(emailAddress, emailSubject, emailContent){
        let message = await transporter.sendMail({
            from: EMAIL.username,
            to:emailAddress,
            subject:emailSubject,
            text:emailContent
        })
    }
}