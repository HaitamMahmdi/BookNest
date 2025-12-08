import { defineStore } from "pinia";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
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
          url: "http://localhost:5174/",
          handleCodeInApp: false,
        };
        await sendEmailVerification(userCredential.user, actionCodeSettings);
        return;
      } catch (error) {
        throw error;
      }
    },
    /*
    async signIn() {
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch {}
    },
    */
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
