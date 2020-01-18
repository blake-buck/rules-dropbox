const rateLimit = require('express-rate-limit');

module.exports = {
    createAccountLimit: rateLimit({
        max: 1,
        windowMs: 60 * 60 * 1000,
        skipSuccessfulRequests:false,
        message:'You have reached your maximum account creation of 1 per hour.'
    })
}