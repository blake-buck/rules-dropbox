const {loggerModel} = require('../models/index')

module.exports = {
    logLoginAttempt: async function(email, ip, result){
        const attempt = {
            ip,
            email,
            time: new Date().toISOString(),
            status:result.status,
            message:result.message,
            isAuthenticated:Boolean(result.isAuthenticated)
        }
        loggerModel.logLoginAttempt(attempt);
    },

    logCreateAccountAttempt: async function(email, ip, result){
        const attempt = {
            ip,
            email,
            time: new Date().toISOString(),
            status: result.status,
            message: result.message
        }
        loggerModel.logCreateAccountAttempt(attempt);
    },

    logResetPasswordAttempt: async function(email, ip, result){
        const attempt = {
            ip,
            email,
            time: new Date().toISOString(),
            status: result.status,
            message: result.message
        }

        loggerModel.logResetPasswordAttempt(attempt);
    }
}