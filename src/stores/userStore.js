import { defineStore } from "pinia";
import { useUserAuth } from "./userAuth";
import { doc, updateDoc } from "firebase/firestore";
import { useUiStore } from "./uiStore";
import { db } from "../firebase";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    coverURL: {
      url: "",
      id: "",
    },
    coverImageHistory: [],
    profileImgURL: {
      url: "",
      id: "",
    },
    profileImageHistory: [],
    quotes: [],
  }),
  actions: {
    async updateProfileMedia(file, type) {
      const { user } = useUserAuth();
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      const uiStore = useUiStore();

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );
        const data = await response.json();
        if (response.ok) {
          const docRef = doc(db, "users", user.uid);
          if (type === "cover") {
            this.coverURL = {
              id: crypto.randomUUID(),
              url: data.secure_url,
              width: data.width,
              height: data.height,
            };
            updateDoc(docRef, {
              coverURL: this.coverURL,
              coverImageHistory: [...this.coverImageHistory, this.coverURL],
            });
          } else if (type === "profile") {
            this.profileImgURL = {
              id: crypto.randomUUID(),
              url: data.secure_url,
              width: data.width,
              height: data.height,
            };
            updateDoc(docRef, {
              profileImgURL: this.profileImgURL,
              profileImageHistory: [
                ...this.profileImageHistory,
                this.profileImgURL,
              ],
            });
          }
          uiStore.showMessageModal("Image uploaded successfully!", "success");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        uiStore.showMessageModal("Error uploading image!", "error");
      }
    },
    async changeProfileMedia(id) {
      const { user } = useUserAuth();
      const uiStore = useUiStore();

      if (!user) return;
      const imgObj =
        this.profileImageHistory.find((el) => id === el.id) ||
        this.coverImageHistory.find((el) => id === el.id);
      if (!imgObj) {
        uiStore.showMessageModal(
          "Failed to update profile image. Please try again.",
          "error",
        );
      }
      this.profileImgURL = imgObj;
      const docRef = doc(db, "users", user.uid);
      updateDoc(docRef, {
        profileImgURL: this.profileImgURL,
      });
      uiStore.showMessageModal("Profile image updated successfully", "success");
    },
    async changeCoverMedia(id) {
      const { user } = useUserAuth();
      const uiStore = useUiStore();
      if (!user) {
        uiStore.showMessageModal(
          "Failed to update cover image. Please try again.",
          "error",
        );
        return;
      }
      const imgObj =
        this.profileImageHistory.find((el) => id === el.id) ||
        this.coverImageHistory.find((el) => id === el.id);
      this.coverURL = imgObj;
      const docRef = doc(db, "users", user.uid);
      updateDoc(docRef, {
        coverURL: this.coverURL,
      });
      uiStore.showMessageModal("Cover image updated successfully", "success");
    },

    async addQuote(text) {
      const { user } = useUserAuth();
      const uiStore = useUiStore();
      if (!user) return;
      const trimmedText = String(text || "").trim();
      if (!trimmedText) {
        uiStore.showMessageModal(
          "Please enter a quote before saving.",
          "error",
        );
        return;
      }
      const docRef = doc(db, "users", user.uid);
      const newQuote = {
        id: crypto.randomUUID(),
        text: trimmedText,
        createdAt: new Date().toISOString(),
      };
      const oldQuotes = this.quotes;
      this.quotes = [...this.quotes, newQuote];
      try {
        await updateDoc(docRef, {
          quotes: this.quotes,
        });
        uiStore.showMessageModal("Quote added successfully", "success");
      } catch (error) {
        this.quotes = oldQuotes;
        console.error("Error adding quote:", error);
        uiStore.showMessageModal("Error adding quote", "error");
      }
    },

    async deleteQuote(quoteId) {
      const { user } = useUserAuth();
      const uiStore = useUiStore();
      if (!user) return;
      const oldQuotes = this.quotes;
      this.quotes = this.quotes.filter((quote) => quote.id !== quoteId);
      const docRef = doc(db, "users", user.uid);
      try {
        await updateDoc(docRef, {
          quotes: this.quotes,
        });
        uiStore.showMessageModal("Quote deleted successfully", "success");
      } catch (error) {
        this.quotes = oldQuotes;
        console.error("Error deleting quote:", error);
        uiStore.showMessageModal("Error deleting quote", "error");
      }
    },
  },
});
