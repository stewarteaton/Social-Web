// dotenv loads environment variables from .env to file into process.env
require('dotenv').config();

const admin = require('firebase-admin');


const adminConfig = {
    credential: admin.credential.cert({
      "type": "service_account",
      "project_id": "socialweb-4fb98",
      "private_key_id": process.env.PRIVATE_KEY_ID,
      "private_key": process.env.PRIVATE_KEY,
      "client_email": process.env.CLIENT_EMAIL,
      "client_id": process.env.CLIENT_ID,
      "auth_uri": process.env.AUTH_URI,
      "token_uri": process.env.TOKEN_URI,
      "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER,
      "client_x509_cert_url": process.env.CLIENT_CERT_URL
      }),
      databaseURL: "https://socialweb-4fb98.firebaseio.com"
}
admin.initializeApp(adminConfig);

const db = admin.firestore();

module.exports = { admin , db };