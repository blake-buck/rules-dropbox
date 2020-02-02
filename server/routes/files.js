const {isAuthenticated} = require('./middleware/index');

module.exports = function(app){
    app.get('/api/file', isAuthenticated, (req, res) => {
        res.send('YOU ARE AUTHENTICATED AND GET TO SEE THIS')
    })

}