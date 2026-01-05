import { defineStore } from "pinia";
import { useUserAuth } from "./userAuth";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
const authStore = useUserAuth();
const user = authStore.user;
const db = getFirestore();
const userRef = doc(db, `users`, user.uid);
export const useUserBooks = defineStore(`userBooks`, {
  state: () => ({
    favorites: null,
    shelfs: null,
    reading: null,
    unsubscribe: null,
  }),
  actions: {
    async addToFavorites(book) {
      if (!user) {
        return;
      }

      const userRef = doc(db, `users`, user.uid);
      await updateDoc(userRef, {
        favorites: arrayUnion(book),
      });
    },
    async removeFromFavorites(bookId) {
      if (!user) {
        return;
      }
      this.favorites = this.favorites.filter((book) => book.id !== bookId);
      await updateDoc(userRef, {
        favorites: this.favorites,
      });
    },
    async loadUserBooks() {
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
    createShelfs(shelfs) {
      this.shelfs = shelfs;
    },
    async addNewShelf(shelfName) {
      if (!user) {
        return;
      }
      this.shelfs.push({ name: shelfName, books: [], id: crypto.randomUUID() });
      await updateDoc(userRef, {
        shelfs: this.shelfs,
      });
    },
    async addBookToShelf(shelfID, book) {
      if (!user) {
        return;
      }
      const shelf = this.shelfs.find((s) => s.id === shelfID);
      if (shelf) {
        shelf.books.push(book);
        await updateDoc(userRef, {
          shelfs: this.shelfs,
        });
      }
    },
    async removeBookFromShelf(shelfID, bookId) {
      if (!user) {
        return;
      }
      const shelf = this.shelfs.find((s) => s.id === shelfID);
      if (shelf) {
        shelf.books = shelf.books.filter((book) => book.id !== bookId);
        await updateDoc(userRef, {
          shelfs: this.shelfs,
        });
      }
    },
  },
});
