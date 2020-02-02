const slowDown = require('express-slow-down');

module.exports = {
    loginSlowDown: slowDown({
        windowMs: 60 * 60 * 1000,
        delayAfter: 2,
        dealayMs: 500
    })
}