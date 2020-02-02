const Firestore = require('@google-cloud/firestore');
const {CLOUD} = require('../../config/config')

const db = new Firestore({
    projectId:CLOUD.projectId,
    keyFilename:CLOUD.accessPath
})

module.exports = async function(collectionName, documentId){
    return await db.doc(`${collectionName}/${documentId}`);
}