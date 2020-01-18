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
    sendEmail: async function(){
        let message = await transporter.sendMail({
            from: EMAIL.username,
            to:EMAIL.username,
            subject:'TESTING NODEMAILER',
            message:'Do not worry, this is just a test'
        })
    }
}