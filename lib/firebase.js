// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAQray6RnnWGH4c5LiPzKH9BoXWf0PtAIE",
	authDomain: "productivity-new-tab-extension.firebaseapp.com",
	projectId: "productivity-new-tab-extension",
	storageBucket: "productivity-new-tab-extension.firebasestorage.app",
	messagingSenderId: "260039699591",
	appId: "1:260039699591:web:1d9c5b4b07af2c64725c22",
	measurementId: "G-2E19MGWSEP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
