import { defineStore } from "pinia";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { getFirestore, collection, setDoc, doc } from "firebase/firestore";
export const useUserAuth = defineStore(`userAuth`, {
  state: () => ({
    user: null,
    authReady: false,
  }),
  actions: {
    async init() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        this.user = user;
      });
    },
    async createAccount(email, password) {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.user = auth.currentUser;
        const actionCodeSettings = {
          url: "http://localhost:5173/",
          handleCodeInApp: false,
        };

        const db = getFirestore();
        const colRef = collection(db, "users");
        await setDoc(doc(colRef, userCredential.user.uid), {
          createdAt: new Date(),
          favorites: [],
          shelfs: [],
          reading: [],
        });

        console.log("User document created in Firestore");
        await sendEmailVerification(userCredential.user, actionCodeSettings);
        console.log("Verification email sent");
        return;
      } catch (error) {
        console.error("Create account error:", error.message);
        throw error;
      }
    },

    async signIn(email, password) {
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        throw error;
      }
    },

    waitForAuth() {
      const auth = getAuth();

      return new Promise((resolve) => {
        const unwatch = onAuthStateChanged(auth, (user) => {
          this.user = user;
          this.authReady = true;
          unwatch(); // stops listener after first value
          resolve();
        });
      });
    },
  },
});
