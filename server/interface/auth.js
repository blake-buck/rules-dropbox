const Firestore = require('@google-cloud/firestore');
const bcrypt = require('bcrypt');
const {CLOUD} = require('../config/config.js');
const emailInterface = require('./email');

const userExists = require('./utils/userExists');
const queryFirestore = require('./utils/queryFirestore');
const createNewDocument = require('./utils/createNewDocument');

// For development purposes the authentication responses will be specific, but changed to more general messages when 
// moved to production
module.exports = {
    login:async function(email, password){
        
        if(await !userExists(email)){
            return {message:'NO USER EXISTS WITH THAT EMAIL', isAuthenticated:false, status:400}
        }

        let userSnapshot = await queryFirestore(CLOUD.credentialsCollection, [{field:'email', value:email}]);
        let document = userSnapshot.docs[0]
        const encryptedCredentials = document.data()
        const compareResults = await bcrypt.compare(password, encryptedCredentials.password)

        if(compareResults){
            return {message:'PASSWORDS ARE THE SAME', isAuthenticated:true, status:200}
        }
        else{
            return {message:'PASSWORDS ARE NOT THE SAME', isAuthenticated:false, status:400}
        }

    },

    createUser:async function(email, password){
        if(await userExists(email)){
            return {message:'USER ALREADY EXISTS WITH THAT EMAIL', status:409}
        }

        try{
            let salt = await bcrypt.genSalt(13);
            let hash = await bcrypt.hash(password, salt)
            await createNewDocument(CLOUD.credentialsCollection, {email, password: hash}, email);
            return {message:'NEW USER CREATED', status:200}
        }
        catch(e){
            return {message:'ERROR CREATING NEW ACCOUNT', status:500}
        }

    },

    resetPassword: async function(email, passwordReset){
        if(await !userExists(email)){
            await createNewDocument('password-reset-tokens', passwordReset);
            return {message:'EMAIL DOES NOT EXIST IN SYSTEM', status: 400}
        }

        try{
            await emailInterface.sendEmail(email, 'Rules-Dropbox Password Reset', `Someone requested a password reset for your account. Use the following token: ${passwordReset.token}`)
        }
        catch(e){
            console.log(e.message)
            await createNewDocument('password-reset-tokens', passwordReset);
            return {message:'ERROR OCCURED WHILE SENDING EMAIL. PLEASE TRY AGAIN.', status: 500}
        }

        passwordReset.isValid = true;
        await createNewDocument('password-reset-tokens', passwordReset);

        return {message:'FOLLOW INSTRUCTIONS IN EMAIL SENT TO GIVEN ADDRESS', status: 200}
    },

    resetPasswordWithToken: async function(email, token){
        const query = [
            {field:'email', value:email},
            {field:'token', value:token}
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

        return {message:'PASSWORD TOKEN IS VALID, PROCEED TO SECURITY QUESTION', status:200}

    },

    
}