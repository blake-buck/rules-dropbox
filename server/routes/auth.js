let authController = require('../controllers/auth');
let loggerController = require('../controllers/logger');

const {isAuthenticated, loginRateLimit, loginSlowDown, createAccountLimit, resetPasswordLimit, emailResetLimit, answerSecurityQuestionLimit, getSecurityQuestionSlowDown} = require('./middleware/index');

module.exports = function(app) {
     // ************************************************ //
    //            Standard User Operations              //
   // ************************************************ //
    app.post('/api/login', loginRateLimit, loginSlowDown, async (req, res) => {
        const {email, password} = req.body;
        let response = await authController.login(email, password);
        await loggerController.logLoginAttempt(email, req.ip, response)

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

    // create user
    app.post('/api/user', createAccountLimit, isAuthenticated, async (req, res) => {
        const {email, password} = req.body;
        let response = await authController.createUser(email, password);
        await loggerController.logCreateAccountAttempt(email, req.ip, response);
        res.status(response.status).send(response)
    });

    // create security questions
    app.post('/api/security-question', isAuthenticated, async (req, res) => {
        const {question, answer} = req.body;
        const response = await authController.createSecurityQuestion(req.session.userId, question, answer);
        res.status(response.status).send(response)
    });


     // ************************************************ //
    //            Password Reset Operations             //
   // ************************************************ //


    app.post('/api/reset-password/email', emailResetLimit,  async (req, res) => {
        const {email} = req.body;
        let response = await authController.sendPasswordResetEmail(email);
        await loggerController.logResetPasswordAttempt(email, req.ip, response)
        res.status(response.status).send(response);
    })

    app.get('/api/reset-password/security-question', getSecurityQuestionSlowDown, async (req, res) => {
        const {email, token} = req.query;
        let response = await authController.getSecurityQuestion(email, token);
        res.status(response.status).send(response);
    })

    app.post('/api/reset-password/security-question', answerSecurityQuestionLimit, async (req, res) => {
        const {email, answer} = req.body;
        const {token} = req.query;
        const response = await authController.answerSecurityQuestion(email, answer, token);
        res.status(response.status).send(response);
    })

    app.post('/api/reset-password', resetPasswordLimit, async (req, res) => {
        const {email, newPassword} = req.body;
        const {token} = req.query;

        let response = await authController.resetPassword(email, newPassword, token);
        res.status(response.status).send(response);
    })

    app.post('/api/update-password', isAuthenticated, async (req, res) => {
        const email = req.session.userId;
        const {password, newPassword} = req.body;
        const response = await authController.updatePassword(email, password, newPassword);
        res.status(response.status).send(response);
    })
    

}