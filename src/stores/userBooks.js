import { defineStore } from "pinia";
import { useUserAuth } from "./userAuth";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
export const useUserBooks = defineStore(`userBooks`, {
  state: () => ({
    favorites: null,
    shelfs: null,
    reading: null,
    unsubscribe: null,
  }),
  actions: {
    async addToFavorites(book) {
      const authStore = useUserAuth();
      const user = authStore.user;
      if (!user) {
        throw new Error("User not authenticated");
      }
      const db = getFirestore();
      const userRef = doc(db, `users`, user.uid);
      await updateDoc(userRef, {
        books: arrayUnion(book),
      });
    },
    async loadUserBooks() {
      const db = getFirestore();
      const userRef = doc(db, `users`, user.uid);
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.favorites = data.favorites;
          this.shelfs = data.shelfs;
          this.reading = data.reading;
        }
      });
    },
    stopUserListener() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
    },
  },
});
