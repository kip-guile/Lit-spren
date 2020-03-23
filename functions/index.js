const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./utils/fbAuth");
const { db } = require("./utils/admin");

const {
  getAllMentions,
  postOneMention,
  getMention,
  commentOnMention,
  likeMention,
  unlikeMention,
  deleteMention
} = require("./handlers/mentions");
const {
  signUp,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require("./handlers/users");

app.get("/mentions", getAllMentions, getMention);
app.post("/mention", FBAuth, postOneMention);
app.get("/mention/:mentionId", getMention);
app.delete("/mention/:mentionId", FBAuth, deleteMention);
app.post("/mention/:mentionId/comment", FBAuth, commentOnMention);
app.get("/mention/:mentionId/like", FBAuth, likeMention);
app.get("/mention/:mentionId/unlike", FBAuth, unlikeMention);

app.post("/signup", signUp);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

exports.api = functions.region("europe-west1").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("europe-west2")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    console.log(snapshot);
    db.doc(`/mention/${snapshot.data().mentionId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "like",
            read: false,
            mentionId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationsOnUnlike = functions
  .region("europe-west2")
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
      });
  });

exports.createNotificationOnComment = functions
  .region("europe-west2")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    db.doc(`/mention/${snapshot.data().mentionId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "comment",
            read: false,
            mentionId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });
