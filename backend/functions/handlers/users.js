
const { db, admin } = require('../utilities/admin');

const config = require('../utilities/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../utilities/validators');

// signs user up
exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };
    // destructuring
    const { valid , errors } = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);

    // declare variable for starting blank user image
    let noImg = "no-img.png";

    let token, userID;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if(doc.exists){
                return res.status(400).json({ handle: "This handle is already taken" });
            } else {
                return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then(data => {
            userID = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userID
            };
            // returns a promise and sets user
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        // r
        .then(() => {
            return res.status(201).json( { token } );
        })
        .catch(error => {
            console.log(error);
            if (error.code === "auth/email-already-in-use"){
                return res.status(400).json({ email: "Email or handle is already in use"});
            } else {
                // return to client  
                res.status(500).json({ general: 'Somethint went wrong, please try again'});
            }
        })
}

// logs user in
exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };
    console.log('****');
    console.log(req.body.email);
    // destructuring
    const { valid , errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);
    
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({token});
        }) 
        .catch(error => {
            console.log(error);
            // can implement auth/wrong-password & auth/user-not-user
            return res.status(403).json({ general: "Wrong username/password, please try again" });
        });
};

// Add user details 
exports.addUserDetails = (req, res) => {
    console.log('AAAAA****');

    
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({ message: 'Details added successfully'})
        })
        .catch(err => {
            console.log(error);
            return res.status(500).json({error: err.code});
        })
};
// Get any user's details
exports.getUserDetails = (req, res) => {
    userData = {};
    db.doc(`/users/${req.params.handle}`).get()
        .then(doc => {
            if(doc.exists){
                userData.user = doc.data();
                return db.collection('shouts').where('userHandle','==', req.params.handle)
                    .orderBy('createdAt','desc').get();
            }  else {
                return res.status(400).json({error: 'User not found'});
            }
        })
        .then(data => {
            userData.shouts = [];
            data.forEach(doc => {
                userData.shouts.push({ 
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userHandle: doc.data().userHandle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    shoutID: doc.id
                })
            });
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code })
        })
}
// Get own user details 
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get().then(doc => {
        if(doc.exists){
            userData.credentials = doc.data();
            return db.collection('likes').where('userHandle', '==', req.user.handle).get();
        }
    })
    .then(data => {
        userData.likes = [];
        data.forEach(doc => {
            userData.likes.push(doc.data());
        });
        return db.collection('notifications').where('recipient','==',req.user.handle)
            .orderBy('createdAt', 'desc').limit(10).get();
    })
    .then(data => {
        userData.notifications = [],
        data.forEach(doc => {
            userData.notifications.push({
                recipient: doc.data().recipient,
                sender: doc.data().sender,
                createdAt: doc.data().createdAt,
                type: doc.data().type,
                read: doc.data().read, 
                shoutID: doc.data().shoutID,
                notificationID: doc.id
            })
        });
        return res.json(userData);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: err.code});
    });
};
// upload profile img for user
exports.uploadImage = (req, res) => {
    // streaming parser
    const BusBoy = require('busboy');
    // comes with node.js
    const path = require('path');
    const os = require('os');
    const fs = require('fs'); // file system?

    const busboy = new BusBoy( { headers: req.headers });
    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname, filename, mimetype); 
        // ensure that only an image is uploaded
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({ error: 'Wrong file type submitted' });
          }
        // my.image.jpeg => ['my','image','.jpeg']
        const imageExtension = filename.split('.')[filename.split('.').length - 1]; 
        // 38482120219.jpeg
        imageFileName = `${Math.round(Math.random()*10000000000).toString()}.${imageExtension}`;

        const filePath = path.join(os.tmpdir(), imageFileName);        
        imageToBeUploaded = { filePath , mimetype };
        file.pipe(fs.createWriteStream(filePath));  // .pipe() is js function
    });
    
    // call back with no argument
    busboy.on('finish', () => {
        console.log('*** HELLO');
        // Firebase admin sdk docs
        admin.storage().bucket(config.storageBucket).upload(imageToBeUploaded.filePath , {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype 
                }
            }
        }).then(() => {
            console.log('****',config.storageBucket); console.log(imageFileName);
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
        })
        .then(() => {
            return res.json({ message: 'Image successfully uploaded' });
        })
        .catch(err=> {
            console.error(err);
            return res.status(500).json({error: err.code });
        })
        
    });
    
    // raw body is property thats in every request object
    busboy.end(req.rawBody);
}

exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach(notificationID => {
        const notification = db.doc(`/notifications/${notificationID}`);
        batch.update(notification, { read: true });
    });
    batch.commit()
        .then(() => {
            return res.json({message: 'Notifications marked read' });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({error: err.code });
        })
}