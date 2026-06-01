import { defineStore } from "pinia";

export const useUiStore = defineStore("uiStore", {
  state: () => ({
    messageModal: {
      text: "",
      type: "",
    },
    areYouSureModal: {
      show: false,
      title: "",
      description: "",
      onConfirm: null,
      onCancel: null,
    },
  }),
  actions: {
    showMessageModal(text, type = "info") {
      this.messageModal.text = text;
      this.messageModal.type = type;
    },
    hideMessageModal() {
      this.messageModal.text = "";
      this.messageModal.type = "";
    },

    showAreYouSureModal(title, description, onConfirm = null, onCancel = null) {
      this.areYouSureModal.show = true;
      this.areYouSureModal.title = title;
      this.areYouSureModal.description = description;
      this.areYouSureModal.onConfirm = onConfirm;
      this.areYouSureModal.onCancel = onCancel;
    },
    hideAreYouSureModal() {
      this.areYouSureModal.show = false;
      this.areYouSureModal.title = "";
      this.areYouSureModal.description = "";
      this.areYouSureModal.onConfirm = null;
      this.areYouSureModal.onCancel = null;
    },
    async confirm() {
      if (this.areYouSureModal.onConfirm) {
        await this.areYouSureModal.onConfirm();
      }
      this.hideAreYouSureModal();
    },

    cancel() {
      this.areYouSureModal.onCancel?.();
      this.hideAreYouSureModal();
    },
  },
});
