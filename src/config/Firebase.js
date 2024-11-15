import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAP-IK9LfLkjPBwyiSoFUubg6C61JKKsFk",
    authDomain: "app-todo-list-b9d95.firebaseapp.com",
    projectId: "app-todo-list-b9d95",
    storageBucket: "app-todo-list-b9d95.firebasestorage.app",
    messagingSenderId: "724886029051",
    appId: "1:724886029051:web:67addcba98cb7710ca665e"
};

const auth = getAuth(initializeApp(firebaseConfig));

const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

const logoutUser = () => {
    return signOut(auth);
};

const onAuthStateChangedListener = (callback) => {
    onAuthStateChanged(auth, callback);
};

export { registerUser, loginUser, logoutUser, onAuthStateChangedListener };