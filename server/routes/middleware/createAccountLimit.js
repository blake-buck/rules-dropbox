const rateLimit = require('express-rate-limit');
const {logCreateAccountAttempt} = require('../../controllers/logger.js');

module.exports = {
    createAccountLimit: rateLimit({
        max: 1,
        windowMs: 60 * 60 * 1000,
        skipSuccessfulRequests:false,
        handler:async (req, res, next) => {
            await logCreateAccountAttempt(req.body.email, req.ip, {message:'You have reached your maximum account creation of 1 per hour', status:429})
            res.status(429).send('You have reached your maximum account creation of 1 per hour.')
        }
    })
}