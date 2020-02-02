let authService = require('../controllers/auth');
let loggerService = require('../controllers/logger');

const {isAuthenticated, loginRateLimit, loginSlowDown, createAccountLimit, resetPasswordLimit} = require('./middleware/index');

module.exports = function(app) {
     // ************************************************ //
    //            Standard User Operations              //
   // ************************************************ //
    app.post('/api/login', loginRateLimit, loginSlowDown, async (req, res) => {
        const {email, password} = req.body;
        let response = await authService.login(email, password);
        await loggerService.logLoginAttempt(email, req.ip, response)

        if(response.isAuthenticated){
            req.session.userId = email
        }

        res.status(response.status).send(response)
    });

    app.post('/api/logout', isAuthenticated, (req, res) => {
        req.session.destroy();
        res.status(200).send('YOU ARE NOW LOGGED OUT')
    })

     // ************************************************ //
    //            Account Setup Operations              //
   // ************************************************ //

    app.post('/api/createUser', createAccountLimit, async (req, res) => {
        const {email, password} = req.body;
        let response = await authService.createUser(email, password);
        await loggerService.logCreateAccountAttempt(email, req.ip, response);
        res.status(response.status).send(response)
    });

    app.post('/api/createSecurityQuestion', isAuthenticated, async (req, res) => {
        const {question, answer} = req.body;
        const response = await authService.createSecurityQuestion(req.session.userId, question, answer);
        res.status(response.status).send(response)
    });


     // ************************************************ //
    //            Password Reset Operations             //
   // ************************************************ //


    app.post('/api/resetPassword', resetPasswordLimit,  async (req, res) => {
        const {email} = req.body;
        let response = await authService.resetPassword(email);
        await loggerService.logResetPasswordAttempt(email, req.ip, response)
        res.status(response.status).send(response);
    })

    app.post('/api/reset-password/token', async (req, res) => {
        const {email, newPassword} = req.body;
        const {token} = req.query;

        let response = await authService.resetPasswordSuccessfully(email, newPassword, token);
        res.status(response.status).send(response);
    })

    app.get('/api/security-question', async (req, res) => {
        const {email, token} = req.query;
        let response = await authService.resetPasswordWithToken(email, token);
        res.status(response.status).send(response);
    })

    app.post('/api/security-question/answer', async (req, res) => {
        const {email, answer} = req.body;
        const {token} = req.query;
        const response = await authService.answerSecurityQuestion(email, answer, token);
        res.status(response.status).send(response);
    })
    

    app.post('/api/resetPassword/emailRecieved', async (req, res) => {
        const {email, token} = req.body;
        let response = await authService.resetPasswordWithToken(email, token);
        res.status(response.status).send(response);
    })

    
}