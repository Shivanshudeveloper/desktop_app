const firebase = require('firebase/app');

const firebaseConfig = {
  apiKey: "AIzaSyBSEx2-ykPTb70keLZh3LAuDtQT2VyCsco",
  authDomain: "evencloud-26d32.firebaseapp.com",
  databaseURL: "https://evencloud-26d32.firebaseio.com",
  projectId: "evencloud-26d32",
  storageBucket: "evencloud-26d32.appspot.com",
  messagingSenderId: "599725599274",
  appId: "1:599725599274:web:8f9a716ca577fc72a1f153",
  measurementId: "G-VSJNQ5LYK5",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
let storage = firebase.storage();
let database = firebase.database();
let auth = firebase.auth();
let firestore = firebase.firestore();
// Authentication for Google
var googleProvider = new firebase.auth.GoogleAuthProvider();
// Authentication for Facebook
var facebookProvider = new firebase.auth.FacebookAuthProvider();
// Authentication for Twitter
var twitterProvider = new firebase.auth.TwitterAuthProvider();


export default {
  firestore,
  auth,
  googleProvider,
  facebookProvider,
  twitterProvider,
  database,
  storage,
  firebase
};
