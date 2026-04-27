import { defineStore } from "pinia";
import { useUserAuth } from "./userAuth";
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
export const useUserBooks = defineStore(`userBooks`, {
  state: () => ({
    favorites: [],
    shelfs: [],
    reading: [],
    reviews: [],
    finishedBooks: [],
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
    isFinisedBook: (state) => (bookID) => {
      return state.finishedBooks.some((id) => id === bookID);
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
          this.reviews = data.reviews || [];
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
      const isIn = this.isInShelfGetter(shelfID, book.id);
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
    /**
     * add a review to a book .
     * @param {string} bookID - The ID of the book to add the review to
     * @param {object} review - an object that contains (title, body, rating, date) of the review
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async addNewReview(bookID, review) {
      const authStore = useUserAuth();
      if (!authStore.user || typeof review !== "object") {
        return;
      }
      const userRef = doc(db, `users`, authStore.user.uid);

      review.id = crypto.randomUUID();
      review.bookID = bookID;
      await updateDoc(userRef, {
        reviews: arrayUnion(review),
      });
    },

    /**
     * remove a review from the user's reviews list.
     * @param {string} reviewID - The ID of the review to remove
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async removeReview(reviewID) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      this.reviews = this.reviews.filter((review) => review.id !== reviewID);
      const userRef = doc(db, `users`, authStore.user.uid);
      await updateDoc(userRef, {
        reviews: this.reviews,
      });
    },

    /**
     * update reading progress or add a new progress entry for a book.
     * @param {string} bookID - The ID of the book
     * @param {object} progObj - object containing (progrees, thought)
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async updateProgrees(bookID, progObj) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      const userRef = doc(db, `users`, authStore.user.uid);

      let book;
      for (const read of this.reading) {
        if (read.id === bookID) {
          book = read;
        }
      }

      const date = new Date();

      if (book) {
        book.reading.push({
          id: crypto.randomUUID(),
          progrees: progObj.progrees,
          thought: progObj.thought,
          date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, // fixed getDay -> getDate
        });
      } else {
        this.reading.push({
          id: bookID,
          reading: [
            {
              id: crypto.randomUUID(),
              progrees: progObj.progrees,
              thought: progObj.thought,
              date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
            },
          ],
        });
      }

      await updateDoc(userRef, {
        reading: this.reading,
      });
    },

    /**
     * delete a specific thought (progress entry) from a book.
     * @param {string} bookID - The ID of the book
     * @param {string} thoughtID - The ID of the thought to delete
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async deleteThought(bookID, thoughtID) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      const userRef = doc(db, `users`, authStore.user.uid);

      this.reading = this.reading.map((book) => {
        if (book.id !== bookID) return book;
        return {
          ...book,
          reading: book.reading.filter((thought) => thought.id !== thoughtID),
        };
      });

      await updateDoc(userRef, {
        reading: this.reading,
      });
    },

    /**
     * add a book to the finished books list.
     * @param {string} bookID - The ID of the book to add
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async addToFinishedBooks(bookID) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      const userRef = doc(db, `users`, authStore.user.uid);

      this.finishedBooks.push(bookID);

      await updateDoc(userRef, {
        finishedBooks: this.finishedBooks,
      });
    },

    /**
     * remove a book from the finished books list.
     * @param {string} bookID - The ID of the book to remove
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async deleteFinishedBook(bookID) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      const userRef = doc(db, `users`, authStore.user.uid);

      this.finishedBooks = this.finishedBooks.filter(
        (book) => book !== bookID, // fixed missing return
      );

      await updateDoc(userRef, {
        finishedBooks: this.finishedBooks,
      });
    },
  },
});
