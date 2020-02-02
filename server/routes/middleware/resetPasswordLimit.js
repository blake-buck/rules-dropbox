const rateLimit = require('express-rate-limit');
const loggerService = require('../../controllers/logger');

module.exports = {
    resetPasswordLimit: rateLimit({
        max:2,
        handler: (req, res, next) => {
            loggerService.logResetPasswordAttempt(req, {status: 429, message:'You have reached your maximum of 2 reset attempts an hour.'})
            res.status(429).send('You have reached your maximum of 2 reset attempts an hour.')
        }
    })
}