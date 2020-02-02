const slowDown = require('express-slow-down');
module.exports = slowDown({
    windowMs:1000 * 60 * 60,
    delayAfter: 2
})