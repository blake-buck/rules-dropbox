const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();


module.exports = async function(email){
    let passwordReset = {
        token: await uidgen.generate(),
        expires: Date.now() + 1000 * 60 * 5,
        created: new Date().toISOString(),
        email,
        isValid:false
    }
    return passwordReset;
}