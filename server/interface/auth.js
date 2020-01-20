const Firestore = require('@google-cloud/firestore');
const bcrypt = require('bcrypt');
const {CLOUD} = require('../config/config.js');
const emailInterface = require('./email');

const db = new Firestore({
    projectId:CLOUD.projectId,
    keyFilename:CLOUD.accessPath
})

module.exports = {
    login:async function(req){
        const credentials = req.body.credentials;
        let snapshot = await db.collection(CLOUD.credentialsCollection).where('username', '==', credentials.email).get()
        
        // For development purposes the authentication responses will be specific, but changed to more general messages when 
        // moved to production
        if(snapshot.size === 1){
            // continue login process
            let document = snapshot.docs[0]
            const encryptedCredentials = document.data()
            const compareResults = await bcrypt.compare(credentials.password, encryptedCredentials.password)

            if(compareResults){
                return {message:'PASSWORDS ARE THE SAME', isAuthenticated:true, status:200}
            }
            else{
                return {message:'PASSWORDS ARE NOT THE SAME', isAuthenticated:false, status:400}
            }

        }
        else if(snapshot.size > 1){
            // This should not happen unless something has gone really wrong
            return {message:'ERROR: TOO MANY ACCOUNTS SHARE THE SAME EMAIL', isAuthenticated:false, status:400}
        }
        else{
            return {message:'NO USER EXISTS WITH THAT EMAIL', isAuthenticated:false, status:400}
        }

    },

    resetPassword: async function(email){
        let snapshot = await db.collection(CLOUD.credentialsCollection).where('username', '==', email).get();
        if(snapshot.size === 1){
            try{
                await emailInterface.sendEmail(email, 'Rules-Dropbox Password Reset', 'Someone requested a password reset for your account.')
                return {message:'FOLLOW INSTRUCTIONS IN EMAIL SENT TO GIVEN ADDRESS', status: 200}
            }
            catch(e){
                console.log(e.message)
                return {message:'ERROR OCCURED WHILE SENDING EMAIL. PLEASE TRY AGAIN.', status: 500}
            }
        }
        else if(snapshot.size > 1){
            // This should not happen unless something has gone really wrong
            return {message:'ERROR: TOO MANY ACCOUNTS SHARE THE SAME EMAIL', status:400}
        }
        else{
            return {message:'EMAIL DOES NOT EXIST IN SYSTEM', status: 400}
        }
    },

    createUser:async function(req){
        const credentials = req.body.credentials;
        let snapshot = await db.collection(CLOUD.credentialsCollection).where('username', '==', credentials.email).get()
        
        if(snapshot.size){
            return {message:'USER ALREADY EXISTS WITH THAT EMAIL', status:409}
        }
        else{
            let newUserRef = await db.collection(CLOUD.credentialsCollection).doc(credentials.email);
            try{
                let salt = await bcrypt.genSalt(13);
                let hash = await bcrypt.hash(credentials.password, salt)
                await newUserRef.set({
                    username:credentials.email,
                    password:hash
                })
                return {message:'NEW USER CREATED', status:200}
            }
            catch(e){
                return {message:'ERROR CREATING NEW ACCOUNT', status:500}
            }

        }
        
    }
}