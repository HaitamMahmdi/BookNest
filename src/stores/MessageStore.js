import { defineStore } from "pinia";

export const useMessageStore = defineStore("messageStore", {
  state: () => ({
    messageText: "",
    messageType: "",
  }),
  actions: {
    updateMessage(text, type) {
      this.messageText = text;
      this.messageType = type;
    },
    dismissMessage() {
      this.messageText = "";
      this.messageType = "";
    },
  },
});
