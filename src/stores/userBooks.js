import { defineStore } from "pinia";
import { useUserAuth } from "./userAuth";
import { useUserStore } from "./userStore";
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useUiStore } from "./uiStore";
export const useUserBooks = defineStore(`userBooks`, {
  state: () => ({
    favorites: [],
    shelves: [],
    reading: [],
    reviews: [],
    finishedBooks: [],
    unsubscribe: null,
  }),
  getters: {
    /*
     * Checks if a book is in the user's favorites list */
    isFavorite: (state) => (bookId) => {
      console.log(bookId);
      return state.favorites.some((book) => book.id === bookId);
    },
    /*
     * Checks if a book is in a specific shelf or in any shelf if no shelfID is provided
     * @param {string} shelfID - The ID of the shelf to check. If not provided, checks all shelves.
     * @param {string} bookID - The ID of the book to check for.
     * @returns {boolean} - Returns true if the book is found in the specified shelf or any shelf, false otherwise.
     */
    isInShelfGetter: (state) => (shelfID, bookID) => {
      const shelf = state.shelves.find((s) => s.id === shelfID);
      if (shelf) {
        return shelf.books.some((book) => book.id === bookID);
      } else if (!shelfID && bookID) {
        for (const shelf of state.shelves) {
          for (const book of shelf.books) {
            if (book.id === bookID) {
              return true;
            }
          }
        }
      }
    },
    /* Checks if a book is finished
     * @param {string} bookID - the Id of the book
     * @returns {boolean} true if the book is finished or false if it is not
     */
    isFinishedBook: (state) => (bookID) => {
      return state.finishedBooks.some((book) => book.book.id === bookID);
    },
  },
  actions: {
    /*
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
    /*
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
      console.log(this.favorites);
      const userRef = doc(db, `users`, authStore.user.uid);
      await updateDoc(userRef, {
        favorites: this.favorites,
      });
    },
    /*
     * Loads the user's books data from Firestore and sets up a real-time listener.
     * Updates favorites, shelves, and reading arrays.
     * @returns {Promise<void>} - Resolves when the initial load is complete.
     */
    async loadUserBooks() {
      const authStore = useUserAuth();
      if (!authStore.user) return;
      const userRef = doc(db, "users", authStore.user.uid);
      const userStore = useUserStore();
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.favorites = data.favorites;
          this.shelves = data.shelves;
          this.reading = data.reading;
          this.reviews = data.reviews || [];
          this.finishedBooks = data.finishedBooks || [];
          userStore.coverURL = data.coverURL || "";
          userStore.profileImgURL = data.profileImgURL || "";
          userStore.coverImageHistory = data.coverImageHistory || [];
          userStore.profileImageHistory = data.profileImageHistory || [];
        }
      });
    },
    /*
     * Stops the real-time listener for user books data.
     * @returns {void}
     */
    stopUserBooksListener() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
    },
    /*
     * Adds a new shelf with the given name to the user's shelves in Firestore.
     * @param {string} shelfName - The name of the new shelf to add.
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async addNewShelf(shelfName) {
      const uiStore = useUiStore();
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      this.shelves.push({
        name: shelfName,
        books: [],
        id: crypto.randomUUID(),
      });
      try {
        const userRef = doc(db, `users`, authStore.user.uid);
        await updateDoc(userRef, {
          shelves: this.shelves,
        });
        uiStore.showMessageModal("Shelf created successfully!", "success");
      } catch (error) {
        console.error("Error creating shelf:", error);
        uiStore.showMessageModal("Error creating shelf!", "error");
        return;
      }
    },
    /*
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
      const shelf = this.shelves.find((s) => s.id === shelfID);
      const isIn = this.isInShelfGetter(shelfID, book.id);
      if (isIn) {
        return;
      }
      if (shelf) {
        shelf.books.push(book);
        const userRef = doc(db, `users`, authStore.user.uid);
        await updateDoc(userRef, {
          shelves: this.shelves,
        });
      }
    },
    /*
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
      const shelf = this.shelves.find((s) => s.id === shelfID);
      if (shelf) {
        shelf.books = shelf.books.filter((book) => book.id !== bookId);
        for (let i = 0; i < this.shelves.length; i++) {
          if (this.shelves[i].id === shelfID) {
            this.shelves[i] = shelf;
            break;
          }
        }
        const userRef = doc(db, `users`, authStore.user.uid);
        await updateDoc(userRef, {
          shelves: this.shelves,
        });
      }
    },
    /*
     * add a review to a book .
     * @param {string} bookID - The ID of the book to add the review to
     * @param {object} review - an object that contains (title, body, rating, date) of the review
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async addNewReview(bookID, review) {
      const authStore = useUserAuth();
      const uiStore = useUiStore();
      if (!authStore.user) {
        uiStore.showMessageModal(
          "Failed to add review. Please try again.",
          "error",
        );
        return;
      }
      try {
        const userRef = doc(db, `users`, authStore.user.uid);
        review.id = crypto.randomUUID();
        review.bookID = bookID;
        await updateDoc(userRef, {
          reviews: arrayUnion(review),
        });
        uiStore.showMessageModal("Review added successfully!", "success");
      } catch (error) {
        console.error("Error adding review:", error);
        uiStore.showMessageModal("Error adding review!", "error");
      }
    },

    /*
     * remove a review from the user's reviews list.
     * @param {string} reviewID - The ID of the review to remove
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async removeReview(reviewID) {
      const authStore = useUserAuth();
      const uiStore = useUiStore();

      if (!authStore.user) {
        return;
      }
      try {
        this.reviews = this.reviews.filter((review) => review.id !== reviewID);
        const userRef = doc(db, `users`, authStore.user.uid);
        await updateDoc(userRef, {
          reviews: this.reviews,
        });
        uiStore.showMessageModal("Review deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting review:", error);
        uiStore.showMessageModal("Error deleting review!", "error");
      }
    },

    /*
     * update reading progress or add a new progress entry for a book.
     * @param {object} bookObj - The book object
     * @param {object} progObj - object containing (progress, thought)
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async updateProgress(bookObj, progObj) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      const userRef = doc(db, `users`, authStore.user.uid);
      let book;
      for (const read of this.reading) {
        console.log(read);
        if (read.book.id === bookObj.id) {
          book = read;
        }
      }
      const date = new Date();
      if (book) {
        book.thoughts.push({
          id: crypto.randomUUID(),
          progress: progObj.progress,
          thought: progObj.thought,
          date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        });
      } else {
        this.reading.push({
          book: bookObj,
          thoughts: [
            {
              id: crypto.randomUUID(),
              progress: progObj.progress,
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
    isReading(bookID) {
      return this.reading.some((book) => book.book.id === bookID);
    },
    /*
     * delete a specific thought (progress entry) from a book.
     * @param {string} bookID - The ID of the book
     * @param {string} thoughtID - The ID of the thought to delete
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async deleteThought(bookID, thoughtID) {
      const uiStore = useUiStore();
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      try {
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
        uiStore.showMessageModal("Thought deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting thought:", error);
        uiStore.showMessageModal("Error deleting thought!", "error");
      }
    },

    /*
     * add a book to the finished books list. and remove it reading progress from reading if it exist and add it to the FinishedObj
     * @param {string} bookID - The ID of the book to add
     * @returns {Promise<void>} - Resolves when the update is complete.
     */
    async addToFinishedBooks(book) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      const userRef = doc(db, `users`, authStore.user.uid);
      const uiStore = useUiStore();
      const isReading = this.isReading(book.id);
      if (isReading) {
        const readingRecord = this.reading.find(
          (record) => record.book.id === book.id,
        );
        const thoughts = readingRecord?.thoughts || [];
        const finishedBookObj = { book: book, thoughts: thoughts };
        const updatedReadingObj = this.reading.filter(
          (record) => record.book.id !== book.id,
        );
        const updatedFinishedObj = [...this.finishedBooks, finishedBookObj];
        try {
          await updateDoc(userRef, {
            reading: updatedReadingObj,
            finishedBooks: updatedFinishedObj,
          });
          this.reading = updatedReadingObj;
          this.finishedBooks = updatedFinishedObj;
          uiStore.showMessageModal("this Book is finished!", "success");
        } catch (error) {
          console.error("Failed to update finished books:", error);
          uiStore.showMessageModal("Failed to update finished books!", "error");
        }
      } else {
        const finishedBookObj = { book: book, thoughts: [] };
        const updatedFinishedObj = [...this.finishedBooks, finishedBookObj];
        try {
          await updateDoc(userRef, {
            finishedBooks: updatedFinishedObj,
          });
          this.finishedBooks = updatedFinishedObj;
          uiStore.showMessageModal("this Book is finished!", "success");
        } catch (error) {
          console.error("Failed to update finished books:", error);
          uiStore.showMessageModal("Failed to update finished books!", "error");
        }
      }
    },
    /**
     * !TODO: Update the delete from finishedBooks action
     ** remove a book from the finished books list.
     ** @param {string} bookID - The ID of the book to remove
     ** @returns {Promise<void>} - Resolves when the update is complete.
     */
    async deleteFinishedBook(bookID) {
      const authStore = useUserAuth();
      if (!authStore.user) {
        return;
      }
      const userRef = doc(db, `users`, authStore.user.uid);

      this.finishedBooks = this.finishedBooks.filter(
        (book) => book.book.id !== bookID,
      );

      await updateDoc(userRef, {
        finishedBooks: this.finishedBooks,
      });
    },
  },
});
