const {db} = require('../utils/admin')

exports.getAllMentions = (req, res) => {
    db.collection('mention').orderBy('time', 'desc').get()
        .then(data => {
            let mentions = []
            data.forEach(mention => {
                mentions.push({
                    mentionId: mention.id,
                    body: mention.data().body,
                    username: mention.data().username,
                    time: mention.data().time
                })
            })
            return res.json(mentions)
        })
        .catch((err) => console.error(err))
}

exports.postOneMention = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({body: 'Body must not be empty'})
    }
    const newMention = {
        body: req.body.body,
        username: req.user.username,
        time: new Date().toISOString()
    }

    db.collection('mention').add(newMention)
        .then(doc => {
            res.json({message: `document ${doc.id} created successfully`})
        })
        .catch(err => {
            res.status(500).json({error: 'something went wrong'})
            console.error(err)
        })
}