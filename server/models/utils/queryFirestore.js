const Firestore = require('@google-cloud/firestore');
const {CLOUD} = require('../../config/config');

const db = new Firestore({
    projectId:CLOUD.projectId,
    keyFilename:CLOUD.accessPath
})

module.exports = async function(collectionName, arr){
    if(arr.length === 0)
        return null;
    
    const collection = await db.collection(collectionName);
    let queryObj = await collection.where(arr[0].field, '==', arr[0].value);
    arr.shift();
    for(let i=0; i< arr.length; i++){
        queryObj = await queryObj.where(arr[i].field, '==', arr[i].value);
    }

    return await queryObj.get();
}