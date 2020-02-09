const functions = require('firebase-functions');
const app = require('express')()

const FBAuth = require('./utils/fbAuth')

const { getAllMentions, postOneMention} = require('./handlers/mentions')
const {signUp, login} = require('./handlers/users')

app.get('/mentions', getAllMentions)
app.post('/mention', FBAuth, postOneMention)
app.post('/signup', signUp)
app.post('/login', login)

exports.api = functions.region('europe-west1').https.onRequest(app)