const admin = require("firebase-admin");
// const serviceAccount = require("./key.json");
require("dotenv").config();
const serviceAccount = JSON.parse(process.env.FIREBASE);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://apx-m6-desafio-687bc-default-rtdb.firebaseio.com",
});

const fireStore = admin.firestore();
//base de datos NoSQL

const rtdb = admin.database();
//base de datos Realtime

export { fireStore, rtdb };
