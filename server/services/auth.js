const {authInterface} = require('../firestore/index.js');
const util = require('util');

module.exports = {
    login: async function(req){
        if(isValidEmail(req.body.credentials.email) && isValidPassword(req.body.credentials.password)){
            
            let loginResults = await authInterface.login(req)
            console.log('LOGIN RESULTS ', loginResults)

            if(loginResults.isAuthenticated){
                req.session.userId = req.body.credentials.email
            }

            return loginResults
        }
        else{
            return {message:'YOU MUST ENTER VALID CREDENTIALS', isAuthenticated:false, status:400}
        }
    },
    createUser : async function(req){
        if(isValidEmail(req.body.credentials.email) && isValidPassword(req.body.credentials.password)){
            console.log('CREATING USER WITH GIVEN CREDENTIALS');
            return await authInterface.createUser(req)
        }
        else{
            return {message:'CANT CREATE USER WITH INVALID CREDENTIALS', status:400}
        }
    }
}

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
    if((new util.TextEncoder()).encode(password).length > 72){// is password too long in bytes? bcrypt requires a max length of 72 bytes per password
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