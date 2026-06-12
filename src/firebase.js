// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 👈 აუცილებელია Firestore ბაზისთვის

const firebaseConfig = {
  apiKey: "AIzaSyBbrTLGIrpPCY31YFGxF6HKjT-wqxB52CE",
  authDomain: "pharmavet-e4a30.firebaseapp.com",
  projectId: "pharmavet-e4a30",
  storageBucket: "pharmavet-e4a30.firebasestorage.app",
  messagingSenderId: "232737747643",
  appId: "1:232737747643:web:160ba330ca233f26b4af9e",
  measurementId: "G-3TRE62J6YF"
};

// Firebase-ის ინიციალიზაცია
const app = initializeApp(firebaseConfig);

// ექსპორტს ვაკეთებთ იმ ფუნქციების, რომლებიც საიტზე გვჭირდება
export const analytics = getAnalytics(app);
export const db = getFirestore(app); // 👈 აი ეს ცვლადი დასჭირდება დისტრიბუციის გვერდს ბაზასთან დასაკავშირებლად