
const functions = require('firebase-functions');
const express = require('express');
const app = express();

// Cors gives headers to tell applications that we can give resources to anyone that requests them
const cors = require('cors');
app.use(cors());

const { db } = require('./utilities/admin'); 

const FBAuth = require('./utilities/fbAuth');

const { getAllShouts, postOneShout, getShout, commentOnShout, likeShout, unlikeShout, deleteShout } = require('./handlers/shouts');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead } = require('./handlers/users');

// FBAuth middleware for protected routes, 
// GET and POST shouts
app.get('/shouts', getAllShouts);
app.post('/shout', FBAuth, postOneShout);
app.get('/shout/:shoutID', getShout)
app.post('/shout/:shoutID/comment', FBAuth, commentOnShout);
app.delete('/shout/:shoutID', FBAuth, deleteShout);
app.get('/shout/:shoutID/like', FBAuth, likeShout);
app.get('/shout/:shoutID/unlike', FBAuth, unlikeShout);


// *** USER Login/ Signup
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
   // these aren't front end routes
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

// NOTIFICATIONS Database Triggers
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        db.doc(`/shouts/${snapshot.data().shoutID}`).get()
            .then(doc => {
                // second condition verifies that we don't notify user that likes his own post
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                    // we need handle of owner of shout
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        shoutID: doc.id
                    });
                } 
            })
            .catch(err => {
                console.error(err); })
    });
// Deletes notification if post is unliked
exports.deleteNotificationOnUnLike = functions.firestore.document('likes/{id}')
    .onDelete((snapshot) => {
         db.doc(`/notifications/${snapshot.id}`).delete()
            .catch(err => {
                console.error(err);  
                return;
            })
    });

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        db.doc(`/shouts/${snapshot.data().shoutID}`).get()
            .then(doc => {
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
                    // we need handle of owner of shout
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment ',
                        read: false,
                        shoutID: doc.id
                    });
                }
            })
            .catch(err => {
                console.error(err);
                return;
            });
    });

// updates user image in shouts collection after changed
exports.onUserImageChange = functions.firestore.document(`/users/{userID}`)
    .onUpdate((change) => {
        console.log(change.before.data());
        console.log(change.after.data());
        // only update if user imageUrl has changed
        if(change.before.data().imageUrl !== change.after.data().imageUrl){
            console.log('Image has changed');
            const batch = db.batch();
            return db.collection('shouts').where('userHandle','==', change.before.data().handle).get()
                .then((data) => {
                    data.forEach(doc => {
                        const shout = db.doc(`/shouts/${doc.id}`);
                        batch.update(shout, { userImage: change.after.data().imageUrl });
                    })
                    return batch.commit();
                });
        } else {
            return true;
        } 
    });

// ERROR: can't get this to work
exports.onShoutDelete = functions.firestore.document(`/shouts/{shoutID}`)
    .onDelete((snapshot, context) => {
        console.log('AAAAAAAAAAAA ************')
        const shoutID = context.params.shoutID;
        console.log(shoutID);
        const batch = db.batch();
        return db.collection('comments').where('shoutID','==', shoutID).get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                });
                return db.collection('likes').where('shoutID','==', shoutID).get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                });
                return db.collection('notifications').where('shoutID','==', shoutID).get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                });
                return batch.commit();
            })
            .catch((err) => {
                console.error(err);
            });
    });
