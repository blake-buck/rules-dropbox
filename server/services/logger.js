const {loggerInterface} = require('../interface/index')

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
        loggerInterface.logLoginAttempt(attempt);
    },

    logCreateAccountAttempt: async function(email, ip, result){
        const attempt = {
            ip,
            email,
            time: new Date().toISOString(),
            status: result.status,
            message: result.message
        }
        loggerInterface.logCreateAccountAttempt(attempt);
    },

    logResetPasswordAttempt: async function(email, ip, result){
        const attempt = {
            ip,
            email,
            time: new Date().toISOString(),
            status: result.status,
            message: result.message
        }

        loggerInterface.logResetPasswordAttempt(attempt);
    }
}