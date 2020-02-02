const queryFirestore = require('./queryFirestore');

module.exports = async function(email, token){
    const query = [
        {field:'email', value:email},
        {field:'token', value:token},
        {field:'isValid', value:true}
    ]

    let tokenSnapshot = await queryFirestore('password-reset-tokens', query);

    if(tokenSnapshot.size !== 1){
        return {message:'INVALID EMAIL AND/OR TOKEN', status:400}
    }

    const data = tokenSnapshot.docs[0].data()

    if(data.isValid === false){
        return {message:'PASSWORD TOKEN IS INVALID', status:400}
    }

    if(Date.now() > data.expires){
        return {message:'PASSWORD TOKEN IS EXPIRED', status:400}
    }

    return {message:'FILLER MESSAGE', status:200}
}