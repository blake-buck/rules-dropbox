const Firestore = require('@google-cloud/firestore');
const {CLOUD} = require('../../config/config')

const db = new Firestore({
    projectId:CLOUD.projectId,
    keyFilename:CLOUD.accessPath
})

module.exports = async function(collectionName, documentContent, documentId){
    const collection = await db.collection(collectionName);
    let newDoc;
    if(documentId){
        newDoc = await collection.doc(documentId)
    }
    else {
        newDoc = await collection.doc();
    }

    newDoc.set(documentContent)
}