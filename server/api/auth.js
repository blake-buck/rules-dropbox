let authService = require('../services/auth');
let loggerService = require('../services/logger');

const {isAuthenticated, loginRateLimit, loginSlowDown, createAccountLimit} = require('./middleware/index');

module.exports = function(app) {
    app.post('/api/login', loginRateLimit, loginSlowDown, async (req, res) => {
        let response = await authService.login(req);
        await loggerService.logLoginAttempt(req, response)
        res.status(response.status).send(response)
    });

    app.post('/api/createUser', createAccountLimit, async (req, res) => {
        let response = await authService.createUser(req);
        await loggerService.logCreateAccountAttempt(req, response);
        res.status(response.status).send(response)
    });

    app.post('/api/logout', isAuthenticated, (req, res) => {
        req.session.destroy();
        res.send('YOU ARE NOW LOGGED OUT')
    })
}