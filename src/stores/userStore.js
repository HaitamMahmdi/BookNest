import { defineStore } from "pinia";
import { useUserAuth } from "./userAuth";
import { doc, updateDoc } from "firebase/firestore";
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
          return true;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        return false;
      }
    },
    async changeProfileMedia(id) {
      const { user } = useUserAuth();
      if (!user) return;
      const imgObj =
        this.profileImageHistory.find((el) => id === el.id) ||
        this.coverImageHistory.find((el) => id === el.id);
      if (!imgObj) {
        return false;
      }
      this.profileImgURL = imgObj;
      const docRef = doc(db, "users", user.uid);
      updateDoc(docRef, {
        profileImgURL: this.profileImgURL,
      });
      return true;
    },
    async changeCoverMedia(id) {
      const { user } = useUserAuth();
      if (!user) return;
      const imgObj =
        this.profileImageHistory.find((el) => id === el.id) ||
        this.coverImageHistory.find((el) => id === el.id);
      this.coverURL = imgObj;
      const docRef = doc(db, "users", user.uid);
      updateDoc(docRef, {
        coverURL: this.coverURL,
      });
      return true;
    },
  },
});
