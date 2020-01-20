const Firestore = require('@google-cloud/firestore');
const {CLOUD} = require('../config/config.js');

const db = new Firestore({
    projectId:CLOUD.projectId,
    keyFilename:CLOUD.accessPath
})

module.exports = {
    logLoginAttempt: async function(attempt){
        let newLog = await db.collection('login-attempts').doc();
        await newLog.set(attempt);
    },
    logCreateAccountAttempt: async function(attempt){
        let newLog= await db.collection('createAccount-attempts').doc();
        await newLog.set(attempt);
    },
    logResetPasswordAttempt: async function(attempt){
        let newLog = await db.collection('passwordReset-attempts').doc();
        await newLog.set(attempt)
    }
}