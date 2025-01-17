const Firestore = require('@google-cloud/firestore');
const bcrypt = require('bcrypt');
const {CLOUD} = require('../config/config.js');
const emailModel = require('./email');

const generatePasswordReset = require('./utils/generatePasswordReset');

const userExists = require('./utils/userExists');
const hasValidToken = require('./utils/hasValidToken');
const queryFirestore = require('./utils/queryFirestore');
const createNewDocument = require('./utils/createNewDocument');
const getDocumentReference = require('./utils/getDocumentReference');
const invalidatePasswordTokens = require('./utils/invalidatePasswordTokens');

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

    createSecurityQuestion:async function(email, question, answer){
        if(await !userExists(email)){
            return {message:'EMAIL DOES NOT EXIST IN SYSTEM', status:400}
        }
        
        const query = [
            {field:'email', value:email}
        ]
        const userSnapshot = await queryFirestore(CLOUD.credentialsCollection, query);
        const userData = userSnapshot.docs[0].data();
        if(userData.securityQuestion){
            return {message:'SECURITY QUESTION ALREADY EXISTS FOR THIS USER', status: 400}
        }

        const userReference = await getDocumentReference(CLOUD.credentialsCollection, email);
        await userReference.set({'securityQuestion': question}, {merge:true})
        try{
            const salt = await bcrypt.genSalt(13);
            const hash = await bcrypt.hash(answer, salt)
            await userReference.set({'securityAnswer': hash}, {merge:true})
        }
        catch(e){
            return {message:'ERROR HASHING SECURITY QUESTION', status:500}
        }
        
        return {message: 'SECURITY QUESTION SET IN DB', status: 200}
    },

    sendPasswordResetEmail: async function(email, passwordReset){
        if(await !userExists(email)){
            await createNewDocument('password-reset-tokens', passwordReset);
            return {message:'EMAIL DOES NOT EXIST IN SYSTEM', status: 400}
        }

        try{
            await emailModel.sendEmail(email, 'Rules-Dropbox Password Reset', `Someone requested a password reset for your account. Use the following token: ${passwordReset.token}`)
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

    getSecurityQuestion: async function(email, token){
        const tokenObject = await hasValidToken(email, token);
        if(tokenObject.status !== 200){
            return tokenObject;
        }

        const credentialQuery = [
            {field:'email', value:email}
        ]
        let credentialSnapshot = await queryFirestore(CLOUD.credentialsCollection, credentialQuery);
        
        if(credentialSnapshot.size !== 1){
            return {message: 'USER DOESN\'T EXIST', status:404}
        }
        const credentialData = await credentialSnapshot.docs[0].data();
        if(!credentialData.securityQuestion){
            return {message:'USER DOESN\'T HAVE A SECURITY QUESTION, CONTACT SYTSEM ADMINISTRATOR FOR ASSISTANCE', status:404}
        }

        return {message:`SECURITY QUESTION: ${credentialData.securityQuestion}`, status:200}

    },

    answerSecurityQuestion: async function(email, answer, token){
        const tokenObject = await hasValidToken(email, token);
        if(tokenObject.status !== 200){
            return tokenObject;
        }

        const query = [
            {field:'email', value:email}
        ]
        const credentialSnapshot = await queryFirestore(CLOUD.credentialsCollection, query);
        if(credentialSnapshot.docs.length !== 1){
            return {message:'ERROR FETCHING USER CREDENTIALS', status:400}
        }
        const credentialData = credentialSnapshot.docs[0].data();
        if(!credentialData.securityQuestion || !credentialData.securityAnswer){
            return {message:'USER DOES NOT HAVE SECURITY QUESTION/SECURITY ANSWER. CONTACT SYSTEM ADMIN FOR ASSISTANCE', status:404}
        }

        const compareResults = await bcrypt.compare(answer, credentialData.securityAnswer);
        
        if(!compareResults){
            return {message: 'INVALID ANSWER TO SECURITY QUESTION', status:404}
        }

        // When the user successfully answers a security question, all existing password reset tokens are invalidated
        // One final token is then created that can be used to reset the password
        await invalidatePasswordTokens(email);

        let passwordReset = await generatePasswordReset(email);
        passwordReset.isValid = true;
        passwordReset.isFinalToken = true;

        await createNewDocument('password-reset-tokens', passwordReset)

        return {message: 'VALID ANSWER TO SECURITY QUESTION. PROCEED TO PASSWORD RESET', token:passwordReset.token, status:200};
    },

    resetPassword: async function(email, newPassword, token){
        const tokenObject = await hasValidToken(email, token, true);
        if(tokenObject.status !== 200){
            return tokenObject
        } 

        // After the user resets their password, the final token they just used needs to be invalidated
        await invalidatePasswordTokens(email);


        try{
            const salt = await bcrypt.genSalt(13);
            const hash = await bcrypt.hash(newPassword, salt);

            const userReference = await getDocumentReference(CLOUD.credentialsCollection, email);
            await userReference.set({password: hash}, {merge:true});

            await emailModel.sendEmail(email, 'Rules-Dropbox Password Reset', 'Your Rules-Dropbox password has been sucessfully reset. If you didn\'t do this, immediately contact the site admin.')
            return {message:'PASSWORD SUCCESSFULLY UPDATED', status:200}
        }
        catch(e){
            return {message:'ERROR UPDATING PASSWORD', status:500}
        }
    },

    updatePassword: async function(email, password, newPassword){
        if(!await userExists(email)){
            return {message:'USER DOES NOT EXIST', status:404}
        }

        const userReference = await getDocumentReference(CLOUD.credentialsCollection, email);
        const userSnapshot = await userReference.get();
        const data = userSnapshot.data()


        try{
            let areSame = await bcrypt.compare(password, data.password);
            if(!areSame){
                return {message:'PASSWORDS DO NOT MATCH', status:400}
            }
        }
        catch(e){
            return {message: 'ERROR COMPARING PASSWORDS', status:500}
        }
        
        try{
            const hash = await bcrypt.hash(newPassword, 13);
            await userReference.set({password:hash}, {merge:true})
            await emailModel.sendEmail(email, 'Rules-Dropbox Password Update', 'Your Rules-Dropbox password has been sucessfully updated. If you didn\'t do this, immediately contact the site admin.')
            return {message:'PASSWORD UPDATED SUCCESSFULLY', status:200}
        }
        catch(e){
            return {message:'ERROR HASHING NEW PASSWORDS', status:500}
        }

    }
    
}