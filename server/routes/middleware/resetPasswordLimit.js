const rateLimit = require('express-rate-limit');
const loggerController = require('../../controllers/logger');

module.exports = rateLimit({
    windowMs: 1000 * 60 * 60,
    max:2,
    handler: async (req, res) => {
        const response = {
            message:'YOU ARE ALLOWED A MAXIMUM OF 2 PASSWORD RESET ATTEMPTS AN HOUR',
            status: 429
        }
        await loggerController.logResetPasswordAttempt(req.body.email, req.ip, response);
        res.status(response.status).send(response);
    }
})