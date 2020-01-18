const rateLimit = require('express-rate-limit');

module.exports = {
    loginRateLimit: rateLimit({
        max: 10,
        windowMs: 60 * 60 * 1000,
        skipSuccessfulRequests:true,
        message:'Too many failed login attempts. Try again in an hour.'
    })
}