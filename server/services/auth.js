const {authInterface} = require('../interface/index.js');
const emailService = require('./email.js');
const util = require('util');

const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();


module.exports = {
    login: async function(email, password){
        if(isValidEmail(email) && isValidPassword(password)){
            let loginResults = await authInterface.login(email, password)

            return loginResults
        }
        else{
            return {message:'YOU MUST ENTER VALID CREDENTIALS', isAuthenticated:false, status:400}
        }
    },
    createUser : async function(email, password){
        if(isValidEmail(email) && isValidPassword(password)){
            console.log('CREATING USER WITH GIVEN CREDENTIALS');
            return await authInterface.createUser(email, password)
        }
        else{
            return {message:'CANT CREATE USER WITH INVALID CREDENTIALS', status:400}
        }
    },
    createSecurityQuestion: async function(email, question, answer){
        if(!isValidEmail(email)){
            return {message:'USER\'S EMAIL IS INVALID', status:400}
        }
        if(!question){
            return {message: 'QUESTION FIELD MUST BE FILLED OUT', status: 400}
        }
        if(!isValidSecurityAnswer(answer)){
            return {message: 'SECURITY ANSWER IS INVALID', status:400}
        }
        return await authInterface.createSecurityQuestion(email, question, answer);
    },
    resetPassword: async function(email){
        if(isValidEmail(email)){
            let passwordReset = {
                token: await uidgen.generate(),
                expires: Date.now() + 1000 * 60 * 5,
                email,
                isValid:false
            }
            return authInterface.resetPassword(email, passwordReset);
        }
        else{
            return {message:'MUST ENTER A VALID EMAIL', status:400}
        }
    },
    resetPasswordWithToken: async function(email, token){
        if(!isValidEmail(email)){
            return {message:'MUST ENTER A VALID EMAIL', status:400}
        }
        return authInterface.resetPasswordWithToken(email, token);
    },

    answerSecurityQuestion: async function(email, answer, token){
        if(!isValidEmail(email)){
            return {message:'MUST ENTER A VALID EMAIL', status:400}
        }
        if(!isValidSecurityAnswer(answer)){
            return {message: 'SECURITY ANSWER IS INVALID', status:400}
        }
        return authInterface.answerSecurityQuestion(email, answer, token);
    }
}

const textEncoder = new util.TextEncoder()

function isValidEmail(email){
    // This code was ripped from online somewhere - cant take credit for it
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        console.log('EMAIL IS VALID');
        return true
    }
    else {
        console.log('EMAIL IS INVALID');
        return false
    }
}

function isValidPassword(password){
    if(textEncoder.encode(password).length > 72){// is password too long in bytes? bcrypt requires a max length of 72 bytes per password
        console.log('PASSWORD BYTE LENGTH IS TOO LONG')
        return false
    }
    else if(password.length < 8){// is password too short?
        console.log('PASSWORD IS TOO SHORT')
        return false
    }
    else if(!/\d/.test(password) && !/[!@#$%^&*()]/.test(password)){// does password contain at least one number and symbol?
        console.log('PASSWORD NEEDS ONE NUMBER AND ONE SYMBOL')
        return false
    }
    else{
        console.log('VALID PASSWORD')
        return true
    }
}

function isValidSecurityAnswer(answer){
    if(textEncoder.encode(answer).length > 72){
        console.log("ANSWER BYTE LENGTH IS TOO LONG")
        return false
    }
    else if(answer.length < 3){
        console.log('ANSWER IS TOO SHORT')
        return false
    }
    else{
        return true
    }
}