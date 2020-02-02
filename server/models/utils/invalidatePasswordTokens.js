const queryFirestore = require('./queryFirestore');
const getDocumentReference = require('./getDocumentReference');

module.exports = async function(email){
    const tokenQuery = [
        {field:'email', value:email},
        {field:'isValid', value:true}
    ]
    const tokens = await queryFirestore('password-reset-tokens', tokenQuery);
    let documentIds = [];
    tokens.forEach(token => documentIds.push(token.id))
    // After the user resets their password, the final token they just used needs to be invalidated
    documentIds.forEach(async id => {
        const tokenRef = await getDocumentReference('password-reset-tokens', id);
        tokenRef.set({isValid:false}, {merge:true})
    })
}