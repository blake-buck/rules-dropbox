const rateLimit = require('express-rate-limit');
const loggerService = require('../../controllers/logger');

module.exports = {
    emailResetLimit: rateLimit({
        max:2,
        handler: async (req, res, next) => {
            const response = {status: 429, message:'You have reached your maximum of 2 reset attempts an hour.'};
            await loggerService.logResetPasswordAttempt(req.body.email,req.ip, response)
            res.status(response.status).send(response);
        }
    })
}