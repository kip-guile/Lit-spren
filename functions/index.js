const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello World!");
});

exports.getMentions = functions.https.onRequest((req, res) => {
    admin.firestore().collection('mention').get()
        .then(data => {
            let mentions = []
            data.forEach(mention => {
                mentions.push(mention.data())
            })
            return res.json(mentions)
        })
        .catch((err) => console.error(err))
})

exports.createMentions = functions.https.onRequest((req, res) => {
    if(req.method !== 'POST') {
        return res.status(400).json({error: 'BAD REQUEST! METHOD NOT ALLOWED'})
    }
    const newMention = {
        body: req.body.body,
        username: req.body.username,
        time: req.body.time
    }

    admin.firestore().collection('mention').add(newMention)
        .then(doc => {
            res.json({message: `document ${doc.id} created successfully`})
        })
        .catch(err => {
            res.status(500).json({error: 'something went wrong'})
            console.error(err)
        })
})