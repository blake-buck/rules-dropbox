const express = require('express');

const helmet = require('helmet');
const session = require('express-session');

const {APPLICATION} = require('./config/config.js')
const useRoutes = require('./routes/index.js');

const {FirestoreStore} = require('@google-cloud/connect-firestore');
const {Firestore} = require('@google-cloud/firestore');



const app = express();

app.use(helmet());

app.use(express.json());

app.use(
    session({

        store: new FirestoreStore({
            dataset: new Firestore({
                kind:'express-sessions'
            })
        }),

        secret:APPLICATION.sessionSecret,
        name:APPLICATION.sessionName,
        key:APPLICATION.sessionKey,
        saveUninitialized:false,
        resave:false,

        cookie:{
            sameSite:true,
            secure:false,
            maxAge:1000 * 60 * 60
        }

    })
)

useRoutes(app);

app.listen(APPLICATION.portNumber, (err) => {
    if(err){
        console.log(err);
    }
    console.log(`LISTENING ON PORT ${APPLICATION.portNumber}`)
    console.log('CLEARING');
    console.log('CLEARING');
    console.log('CLEARING');
    console.log('CLEARING');
})