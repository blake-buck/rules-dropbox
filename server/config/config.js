let dotenv = require('dotenv');

dotenv.config();

const config = {
    APPLICATION:{
        portNumber:process.env.PORT,
        sessionSecret:process.env.SESSION_SECRET,
        sessionName:process.env.SESSION_NAME,
        sessionKey:process.env.SESSION_KEY,
        production:process.env.PRODUCTION
    },
    CLOUD:{
        accessPath:process.env.GOOGLE_APPLICATION_CREDENTIALS,
        projectId:process.env.PROJECT_ID,
        credentialsCollection:process.env.CREDENTIALS_COLLECTION
    },
    EMAIL:{
        username:process.env.EMAILADDRESS,
        password:process.env.EMAILPASSWORD,
        service:process.env.EMAILSERVICE
    }
}

module.exports = config;