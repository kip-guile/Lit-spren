const { db } = require("../utils/admin");

exports.getAllMentions = (req, res) => {
  db.collection("mention")
    .orderBy("time", "desc")
    .get()
    .then((data) => {
      let mentions = [];
      data.forEach((mention) => {
        mentions.push({
          mentionId: mention.id,
          body: mention.data().body,
          username: mention.data().username,
          time: mention.data().time,
          userImage: doc.data().userImage,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
        });
      });
      return res.json(mentions);
    })
    .catch((err) => console.error(err));
};

exports.postOneMention = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }
  const newMention = {
    body: req.body.body,
    userImage: req.user.imageUrl,
    username: req.user.username,
    time: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("mention")
    .add(newMention)
    .then((doc) => {
      const reMention = newMention;
      reMention.mentionId = doc.id;
      res.json(reMention);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

exports.getMention = (req, res) => {
  let mentionData = {};
  console.log(req.params.mentionId);
  db.doc(`/mention/${req.params.mentionId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Mention not found" });
      }
      mentionData = doc.data();
      mentionData.mentionId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("mentionId", "==", req.params.mentionId)
        .get();
    })
    .then((data) => {
      mentionData.comments = [];
      data.forEach((doc) => {
        mentionData.comments.push(doc.data());
      });
      return res.json(mentionData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.commentOnMention = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    mentionId: req.params.mentionId,
    username: req.user.username,
    userImage: req.user.imageUrl,
  };

  db.doc(`/mention/${req.params.mentionId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "mention not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

exports.likeMention = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("username", "==", req.user.username)
    .where("mentionId", "==", req.params.mentionId)
    .limit(1);

  const mentionDocument = db.doc(`/mention/${req.params.mentionId}`);

  let mentionData;

  mentionDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        mentionData = doc.data();
        mentionData.mentionId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "mention not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            mentionId: req.params.mentionId,
            username: req.user.username,
          })
          .then(() => {
            mentionData.likeCount++;
            return mentionDocument.update({ likeCount: mentionData.likeCount });
          })
          .then(() => {
            return res.json(mentionData);
          });
      } else {
        return res.status(400).json({ error: "mention already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeMention = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("username", "==", req.user.username)
    .where("mentionId", "==", req.params.mentionId)
    .limit(1);

  const mentionDocument = db.doc(`/mention/${req.params.mentionId}`);

  let mentionData;

  mentionDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        mentionData = doc.data();
        mentionData.mentionId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "mention not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "mention not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            mentionData.likeCount--;
            return mentionDocument.update({ likeCount: mentionData.likeCount });
          })
          .then(() => {
            res.json(mentionData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.deleteMention = (req, res) => {
  const document = db.doc(`/mention/${req.params.mentionId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Mention not found" });
      }
      if (doc.data().username !== req.user.username) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Scream deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
