// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOkahMiGpFyCx9H-vAYawDONBI-Md5oXg",
  authDomain: "spck-jsi12-15bba.firebaseapp.com",
  projectId: "spck-jsi12-15bba",
  storageBucket: "spck-jsi12-15bba.firebasestorage.app",
  messagingSenderId: "950022205797",
  appId: "1:950022205797:web:3be11dbecfef11da48318c",
  measurementId: "G-WZ1M1QMDLC"
};


// Initialize Firebase: Ctrl + ?
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Initialize Cloud Storage and get a reference to the service
// const storage = firebase.storage();
