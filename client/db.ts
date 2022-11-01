import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
let API_BASE_URL: string;

// @ts-ignore
if (process.env.NODE_ENV == "production") {
  API_BASE_URL = "";
} else {
  API_BASE_URL = "http://localhost:3048";
}

const firebaseConfig = {
  apiKey: "AIzaSyApIMTqeB8o9HCnLTFUWRhmKFjAdmG3l1w",
  authDomain: "apx-m6-desafio-687bc.firebaseapp.com",
  databaseURL: "https://apx-m6-desafio-687bc-default-rtdb.firebaseio.com",
  projectId: "apx-m6-desafio-687bc",
  storageBucket: "apx-m6-desafio-687bc.appspot.com",
  messagingSenderId: "327194026908",
  appId: "1:327194026908:web:a8ba4c67f7334b6e175e59",
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase();
const rtdbApp = getDatabase(app);

export { API_BASE_URL, getDatabase, ref, onValue, app, rtdb, rtdbApp };
