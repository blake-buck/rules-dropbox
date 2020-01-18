const {loggerInterface} = require('../interface/index')

module.exports = {
    logLoginAttempt: async function(req, result){
        const attempt = {
            ip:req.ip,
            email:req.body.credentials.email,
            time: new Date().toISOString(),
            status:result.status,
            message:result.message,
            isAuthenticated:Boolean(result.isAuthenticated)
        }
        loggerInterface.logLoginAttempt(attempt);
    },

    logCreateAccountAttempt: async function(req, result){
        const attempt = {
            ip: req.ip,
            time: new Date().toISOString(),
            status: result.status,
            message: result.message
        }
        loggerInterface.logCreateAccountAttempt(attempt);
    }
}