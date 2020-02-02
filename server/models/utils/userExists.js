const Firestore = require('@google-cloud/firestore');
const {CLOUD} = require('../../config/config');

const db = new Firestore({
    projectId:CLOUD.projectId,
    keyFilename:CLOUD.accessPath
})

module.exports = async function(email){
    let userSnapshot = await db.collection(CLOUD.credentialsCollection).where('email', '==', email).get();
    if(userSnapshot.size === 1)
        return true;

    return false;
}