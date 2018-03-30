import * as express from 'express';
import * as bodyParse from 'body-parser';
import * as firebase from 'firebase-admin';
import v1Route from "./routes/v1";

const config = require('./config.json');

/*
 * Initialize firebase
 */
const firebaseServiceAccount = require('./shortenmenow-firebase.json');
firebase.initializeApp({
    credential: firebase.credential.cert(firebaseServiceAccount),
    databaseURL: config.databaseURL
});

const app = express();
app.set('dbConnection', firebase);
app.set('config', config);

app.use(bodyParse());
app.use(function(req, res, next) {
    console.log(Date.now() + " " + req.method + " " + req.originalUrl);
    next();
});

app.use("/api/v1", v1Route, function(req, res) {
    res.status(501).json({
        "status": 501,
        "message": "Sorry, we don't support this api right now!"
    });
});


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});

export default app;
 
