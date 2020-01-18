const rateLimit = require('express-rate-limit');
const {logLoginAttempt} = require('../../services/logger');

module.exports = {
    loginRateLimit: rateLimit({
        max: 10,
        windowMs: 60 * 60 * 1000,
        skipSuccessfulRequests:true,
        handler: async (req, res, next) => {
            await logLoginAttempt(req, {message:'Too many failed login attempts. Try again in an hour', status:429})
            res.status(429).send('Too many failed login attempts. Try again in an hour.')
        }
    })
}