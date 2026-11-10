import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyAaVIIjcgn-QVVLrOSiW1DswoQSxqB_xjY",
  authDomain: "egytour-492d1.firebaseapp.com",
  databaseURL: "https://egytour-492d1-default-rtdb.firebaseio.com",
  projectId: "egytour-492d1",
  storageBucket: "egytour-492d1.appspot.com",
  messagingSenderId: "808330931692",
  appId: "1:808330931692:web:6d906a0692b49e72ea24c9",
  measurementId: "G-T2NRPV1JKE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storedb = getFirestore(app)
export const auth = getAuth(app);
export const db = getDatabase(app);

export { app, analytics };
