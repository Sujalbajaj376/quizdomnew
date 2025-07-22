import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbt_oIWUtN0OBVpvV4T6Qe6DsBWS_Dxjk",
  authDomain: "quizdom-e8efb.firebaseapp.com",
  projectId: "quizdom-e8efb",
  storageBucket: "quizdom-e8efb.firebasestorage.app",
  messagingSenderId: "1075482356492",
  appId: "1:1075482356492:web:38d90041cb65fab95d7729",
  measurementId: "G-FF2KQ5V9CR"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;