const {loggerInterface} = require('../firestore/index')

module.exports = {
    logLoginAttempt: async function(req, result){
        const attempt = {
            ip:req.ip,
            email:req.body.credentials.email,
            time: new Date().toISOString(),
            status:result.status,
            message:result.message,
            isAuthenticated:result.isAuthenticated
        }
        loggerInterface.logLoginAttempt(attempt);
    }
}