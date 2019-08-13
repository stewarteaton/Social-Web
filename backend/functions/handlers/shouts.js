
const { db }= require('../utilities/admin');

// console.log(db.collection('shouts'));

exports.getAllShouts = ( req , res ) => {
    db.collection('shouts')
    .orderBy('createdAt','desc') //lists shouts in most recent order
    .get()
    .then((data) => {
        let shouts = [];
        data.forEach((doc) => {
            shouts.push({
                shoutID: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt,
                commentCount: doc.data().commentCount,
                likeCount: doc.data().likeCount,
                userImage: doc.data().userImage
            });
        });
        return res.json(shouts);
    }).catch(error => console.error(error));
}

exports.postOneShout = (req, res) => {
    if (req.body.body.trim() === '') {
        return res.status(400).json({ body: 'Body must not be empty'});
    }

    const newShout = {
        body: req.body.body,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl,
        createdAt: new Date().toISOString(),
        // just been created
        likeCount: 0,
        commentCount: 0
    };

      db.collection('shouts')
        .add(newShout)
        .then(doc => {
            const resShout = newShout;
            // you can edit a key in a const, but cannot change data type
            resShout.shoutID = doc.id;
            res.json(resShout);  
        })
        .catch(error => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(error);  
        })
};

// fetch one shout
exports.getShout = (req, res) => {
    let shoutData = {};
    db.doc(`/shouts/${req.params.shoutID}`).get()
        .then(doc => {
            if(!doc.exists){
                return res.status(404).json({error: 'Shout not found'})
            }
            shoutData = doc.data();
            shoutData.shoutID = doc.id;
            console.log(req.params.shoutID);
            return db.collection('comments').orderBy('createdAt','desc').where('shoutID','==',`${req.params.shoutID}`).get();
        })
        .then(snapshot => {
            if (snapshot.empty) {
              console.log('No matching documents.');
              return res.json(shoutData);
            }  

            shoutData.comments = [];

            snapshot.forEach(doc => {
              console.log(doc.id, '=>', doc.data());
              shoutData.comments.push(doc.data());
            });
            return res.json(shoutData)
          })
          .catch(err => {
            console.log('Error getting documents', err);
        })
        // .then((data) => {
        //     shoutData.comments = [];
        //     data.forEach((doc) => {
        //         shoutData.comments.push(doc.data());
        //     });
        //     console.log(shoutData.comments)
        //     return res.json(shoutData);
        // })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err.code })
        })
}

// Post Comment on a shout
exports.commentOnShout = (req, res) => {
    if(req.body.body.trim() === '') return res.status(400).json({ comment: 'Comment must not be empty' });

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        shoutID: req.params.shoutID,
        // from middleware user object
        userHandle: req.user.handle,
        userImage: req.user.imageUrl 
    };

    // confirm shout still exists
    db.doc(`/shouts/${req.params.shoutID}`).get()
        .then(doc => {
            if(!doc.exists) {
                return res.status(404).json({error: "Shout not found"})
            }
            // updates comment count on shouts
            return doc.ref.update({ commentCount: doc.data().commentCount +1})
        })
        .then(() => {
            // .add adds document pass it a json
            return db.collection('comments').add(newComment);
        })
        .then(() => {
            // returns comment back to user to add to interface 
            res.json(newComment);
        })
        .catch(err => {
            console.log(err); 
            res.status(500).json('Something went wrong');
        });
}

// like a shout
// theory, inefficient to store all likes in comments document, better to spread out, likes and comments in different collections
exports.likeShout = (req, res) => {
    // query from DB and check if like document alreay exist. if user already liked post
    // check if shout still exists
    const likeDocument = db.collection('likes').where('userHandle','==', req.user.handle)
        .where('shoutID','==', req.params.shoutID).limit(1); // returns array with 1 document
    
    const shoutDocument = db.doc(`/shouts/${req.params.shoutID}`);

    let shoutData = {};

    shoutDocument.get().then(doc =>{
        if(doc.exists){
            shoutData = doc.data();
            shoutData.shoutID = doc.id;
            return likeDocument.get();
        } else {
            return res.status(404).json({error: 'shout not found'});
        }
    })
    .then(data => {
        console.log('***** HANDLE'+ req.params.handle);
        if(data.empty){
            return db.collection('likes').add({
                shoutID: req.params.shoutID,
                userHandle: req.user.handle
            })
            .then(() => {
                shoutData.likeCount++;
                return shoutDocument.update({ likeCount: shoutData.likeCount });
            })
            .then(() => {
                return res.json(shoutData);
            })
        } else {
            return res.status(400).json({ error: 'Shout already liked' });
        }
    })
    .catch(err => { 
        console.log(err);
        res.status(500).json({error: err.code })
    })
}

exports.unlikeShout = (req, res) => {
    // query from DB and check if like document alreay exist. if user already liked post
    // check if shout still exists
    const likeDocument = db.collection('likes').where('userHandle','==', req.user.handle)
        .where('shoutID','==', req.params.shoutID).limit(1); // returns array with 1 document
    
    const shoutDocument = db.doc(`/shouts/${req.params.shoutID}`);

    let shoutData = {};

    shoutDocument.get().then(doc =>{
        if(doc.exists){
            shoutData = doc.data();
            shoutData.shoutID = doc.id;
            return likeDocument.get();
        } else {
            return res.status(404).json({error: 'shout not found'});
        }
    })
    .then(data => {
        if(data.empty){
            return res.status(400).json({ error: 'Shout not liked' });
        } else {
            return db.doc(`/likes/${data.docs[0].id}`).delete()
                .then(() => {
                    shoutData.likeCount--;
                    return shoutDocument.update({ likeCount: shoutData.likeCount })
                })
                .then(() => {
                    res.json(shoutData);
                })
        }
    })
    .catch(err => { 
        console.log(err);
        res.status(500).json({error: err.code })
    })
}

// Delete Shout
exports.deleteShout = (req, res) => {
    const document = db.doc(`/shouts/${req.params.shoutID}`);
    document.get()
        .then((doc) => {
            if(!doc.exists){
                return res.status(404).json({error: 'Shout not found'})
            }
            // check if user id is the same as user id of shout, 
            if(doc.data().userHandle !== req.user.handle){
                return res.status(403).json({error: 'Unauthorized'})
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({message: 'Shout deleted successfully'});
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({error: err.code});
        })
}
