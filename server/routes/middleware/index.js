const {isAuthenticated} = require('./isAuthenticated.js');
const {loginRateLimit} = require('./loginRateLimit');
const {loginSlowDown} = require('./loginSlowDown');
const {createAccountLimit} = require('./createAccountLimit');
const {emailResetLimit} = require('./emailResetLimit');
const answerSecurityQuestionLimit = require('./answerSecurityQuestionLimit');
const resetPasswordLimit = require('./resetPasswordLimit');
const getSecurityQuestionSlowDown = require('./getSecurityQuestionSlowDown');

module.exports = {
    isAuthenticated,
    loginRateLimit,
    loginSlowDown,
    createAccountLimit,
    emailResetLimit,
    getSecurityQuestionSlowDown,
    answerSecurityQuestionLimit,
    resetPasswordLimit
}