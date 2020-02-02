const createNewDocument = require('./utils/createNewDocument');

module.exports = {
    logLoginAttempt: async function(attempt){
        await createNewDocument('login-attempts', attempt);
    },
    logCreateAccountAttempt: async function(attempt){
        await createNewDocument('create-account-attempts', attempt);
    },
    logResetPasswordAttempt: async function(attempt){
        await createNewDocument('password-reset-attempts', attempt);
    }
}