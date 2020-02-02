let authRoutes = require('./auth.js');
let fileRoutes = require('./files.js');

module.exports = function(app){
    authRoutes(app);
    fileRoutes(app);
}