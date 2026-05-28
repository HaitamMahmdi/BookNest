import { defineStore } from "pinia";
import { useUserAuth } from "./userAuth";
import { doc, updateDoc } from "firebase/firestore";
import { useMessageStore } from "./MessageStore";
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
  }),
  actions: {
    async updateProfileMedia(file, type) {
      const { user } = useUserAuth();
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      const messageStore = useMessageStore();

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
          messageStore.updateMessage("Image uploaded successfully!", "success");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        messageStore.updateMessage("Error uploading image!", "error");
      }
    },
    async changeProfileMedia(id) {
      const { user } = useUserAuth();
      const messageStore = useMessageStore();

      if (!user) return;
      const imgObj =
        this.profileImageHistory.find((el) => id === el.id) ||
        this.coverImageHistory.find((el) => id === el.id);
      if (!imgObj) {
        messageStore.updateMessage(
          "Failed to update profile image. Please try again.",
          "error",
        );
      }
      this.profileImgURL = imgObj;
      const docRef = doc(db, "users", user.uid);
      updateDoc(docRef, {
        profileImgURL: this.profileImgURL,
      });
      messageStore.updateMessage(
        "Profile image updated successfully",
        "success",
      );
    },
    async changeCoverMedia(id) {
      const { user } = useUserAuth();
      const messageStore = useMessageStore();
      if (!user) {
        messageStore.updateMessage(
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
      messageStore.updateMessage("Cover image updated successfully", "success");
    },
  },
});
