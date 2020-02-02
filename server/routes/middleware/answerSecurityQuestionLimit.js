const rateLimit = require('express-rate-limit');
const loggerController = require('../../controllers/logger');

module.exports = rateLimit({
    max:3,
    skipSuccessfulRequests:true,
    windowMs: 60 * 60 * 1000,
    handler: async (req, res) => {
        const response = {
            message:'YOU HAVE GIVEN THE WRONG ANSWER THREE TIMES IN A ROW, TRY AGAIN IN AN HOUR',
            status:429
        }
        await loggerController.logResetPasswordAttempt(req.body.email, req.ip, response);
        res.status(response.status).send(response);
    }
})