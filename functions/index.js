const functions = require('firebase-functions');
const app = require('express')()

const FBAuth = require('./utils/fbAuth')

const { getAllMentions, postOneMention} = require('./handlers/mentions')
const {signUp, login, uploadImage, addUserDetails, getAuthenticatedUser} = require('./handlers/users')

app.get('/mentions', getAllMentions)
app.post('/mention', FBAuth, postOneMention)
app.post('/signup', signUp)
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetails)
app.get('/user', FBAuth, getAuthenticatedUser)

exports.api = functions.region('europe-west1').https.onRequest(app)