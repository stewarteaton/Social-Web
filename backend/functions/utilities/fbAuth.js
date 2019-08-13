
const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        // splits and gets second element after Bearers 
        idToken = req.headers.authorization.split('Bearer ')[1];
        console.log("ID Token:" +idToken)
    } else {
        console.log("No token found");
        return res.status(403).json({ error: "Unauthroized"});
    }

    // verify token 
    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            req.user = decodedToken;
            console.log(decodedToken);
            return db.collection('users')
                .where('userID', '==', req.user.uid)
                .limit(1)
                .get()
        })
        .then((data) => {
            console.log('****'); console.log(data.docs[0].data().handle);
            // attaches handle associated with user to request user handle 
            req.user.handle = data.docs[0].data().handle;
            req.user.imageUrl = data.docs[0].data().imageUrl
            // proceeds to next piece of middle ware
            return next();
        })
        .catch(err => {
            console.error("Error while verifying token", err);
            return res.status(403).json(err);
        })
}