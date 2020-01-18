module.exports = {
    isAuthenticated:function(req, res, next){
        if(req.session && req.session.userId ){
            console.log(req.session)
            console.log(req.session.cookie.maxAge);
            next();
        }
        else{
            console.log('YOU AINT AUTHENTICATED')
            res.status(401).send('YOU AINT AUTHENTICATED')
        }
        
    }
}