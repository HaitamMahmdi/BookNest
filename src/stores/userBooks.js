import { defineStore } from "pinia";
import { useUserAuth } from "./userAuth";
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
export const useUserBooks = defineStore(`userBooks`, {
  state: () => ({
    favorites: [],
    shelfs: [],
    reading: [],
    unsubscribe: null,
  }),
  getters: {
    /* Checks if a book is in the user's favorites list */
    isFavorite: (state) => (bookId) => {
      return state.favorites.some((book) => book.id === bookId);
    },
    /** Checks if a book is in a specific shelf or in any shelf if no shelfID is provided
     * @param {string} shelfID - The ID of the shelf to check. If not provided, checks all shelfs.
     * @param {string} bookID - The ID of the book to check for.
     * @returns {boolean} - Returns true if the book is found in the specified shelf or any shelf, false otherwise.
     */
    isInShelfGetter: (state) => (shelfID, bookID) => {
      const shelf = state.shelfs.find((s) => s.id === shelfID);
      if (shelf) {
        return shelf.books.some((book) => book.id === bookID);
      } else if (!shelfID && bookID) {
        for (const shelf of state.shelfs) {
          for (const book of shelf.books) {
            if (book.id === bookID) {
              return true;
            }
          }
        }
      }
    },
  },
  actions: {
    /**
     * Adds a book to the user's favorites list in Firestore.
     * @param {object} book - The book object to be saved. Should have an 'id' property.
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async addToFavorites(book) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      const userRef = doc(db, `users`, authStore.user.uid);
      await updateDoc(userRef, {
        favorites: arrayUnion(book),
      });
    },
    /**
     * Removes a book from the user's favorites list in Firestore.
     * @param {string} bookId - The ID of the book to remove from favorites.
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async removeFromFavorites(bookId) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      this.favorites = this.favorites.filter((book) => book.id !== bookId);
      const userRef = doc(db, `users`, authStore.user.uid);
      await updateDoc(userRef, {
        favorites: this.favorites,
      });
    },
    /**
     * Loads the user's books data from Firestore and sets up a real-time listener.
     * Updates favorites, shelfs, and reading arrays.
     * @returns {Promise<void>} - Resolves when the initial load is complete.
     */
    async loadUserBooks() {
      const authStore = useUserAuth();
      if (!authStore.user) return;
      const userRef = doc(db, "users", authStore.user.uid);

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
    /**
     * Stops the real-time listener for user books data.
     * @returns {void}
     */
    stopUserBooksListener() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
    },
    /**
     * Creates a new shelf with the given name and adds it to the user's shelves in Firestore.
     * @param {string} shelfName - The name of the new shelf to create.
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async createShelfs(shelfName) {
      this.shelfs.push({ name: shelfName, books: [], id: crypto.randomUUID() });
      const authStore = useUserAuth();
      if (!authStore.user) return;
      const userRef = doc(db, `users`, authStore.user.uid);
      await updateDoc(userRef, {
        shelfs: this.shelfs,
      });
    },
    /**
     * Adds a new shelf with the given name to the user's shelves in Firestore.
     * @param {string} shelfName - The name of the new shelf to add.
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async addNewShelf(shelfName) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      this.shelfs.push({ name: shelfName, books: [], id: crypto.randomUUID() });
      const userRef = doc(db, `users`, authStore.user.uid);
      await updateDoc(userRef, {
        shelfs: this.shelfs,
      });
    },
    /**
     * Adds a book to a specific shelf in the user's shelves in Firestore.
     * @param {string} shelfID - The ID of the shelf to add the book to.
     * @param {object} book - The book object to add to the shelf. Should have an 'id' property.
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async addBookToShelf(shelfID, book) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      const shelf = this.shelfs.find((s) => s.id === shelfID);
      const isIn = this.isInShelf(shelfID, book.id);
      if (isIn) {
        return;
      }
      if (shelf) {
        shelf.books.push(book);
        const userRef = doc(db, `users`, authStore.user.uid);
        await updateDoc(userRef, {
          shelfs: this.shelfs,
        });
      }
    },
    /**
     * Removes a book from a specific shelf in the user's shelves in Firestore.
     * @param {string} shelfID - The ID of the shelf to remove the book from.
     * @param {string} bookId - The ID of the book to remove from the shelf.
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async removeBookFromShelf(shelfID, bookId) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      const shelf = this.shelfs.find((s) => s.id === shelfID);
      if (shelf) {
        shelf.books = shelf.books.filter((book) => book.id !== bookId);
        for (let i = 0; i < this.shelfs.length; i++) {
          if (this.shelfs[i].id === shelfID) {
            this.shelfs[i] = shelf;
            break;
          }
        }
        const userRef = doc(db, `users`, authStore.user.uid);
        await updateDoc(userRef, {
          shelfs: this.shelfs,
        });
      }
    },
  },
});
