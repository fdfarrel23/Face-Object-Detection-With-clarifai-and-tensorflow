import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const app = firebase.initializeApp({
  apiKey: "AIzaSyD5o6DuiYb9Bwcf2uMMuxwqlXlcEYzpUxM",
  authDomain: "face-recognition-1e6ea.firebaseapp.com",
  databaseURL: "https://face-recognition-1e6ea-default-rtdb.firebaseio.com",
  projectId: "face-recognition-1e6ea",
  storageBucket: "face-recognition-1e6ea.appspot.com",
  messagingSenderId: "368765278330",
  appId: "1:368765278330:web:49eceb455aa2c6594803c3",
  measurementId: "G-5QGESNWJ1Z"
  });

  
  export default app;