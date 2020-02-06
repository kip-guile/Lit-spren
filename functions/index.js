const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp()

const express = require('express')
const app = express()


app.get('/mentions', (req, res) => {
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

app.post('/mention', (req, res) => {
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

exports.api = functions.https.onRequest(app)