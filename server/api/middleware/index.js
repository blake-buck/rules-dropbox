const {isAuthenticated} = require('./isAuthenticated.js');
const {loginRateLimit} = require('./loginRateLimit');
const {loginSlowDown} = require('./loginSlowDown');
const {createAccountLimit} = require('./createAccountLimit');

module.exports = {
    isAuthenticated,
    loginRateLimit,
    loginSlowDown,
    createAccountLimit
}