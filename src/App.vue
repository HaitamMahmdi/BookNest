<script setup>
import { onMounted, onUnmounted } from "vue";
import HeaderCom from "@/components/HeaderCom.vue";
import { useUserAuth } from "@/stores/userAuth";
import { useUserBooks } from "@/stores/userBooks";
import FooterCom from '@/components/FooterCom.vue'
import MessageModal from "@/components/modals/MessageModal.vue";
import { useMessageStore } from "@/stores/MessageStore";
const messageStore = useMessageStore();
const userAuth = useUserAuth();
const userBooks = useUserBooks();

userAuth.init();

onMounted(async () => {
  await userAuth.waitForAuth();
  if (userAuth.user) {
    userBooks.loadUserBooks();
  }
});

onUnmounted(() => {
  userBooks.stopUserBooksListener();
});
</script>
<template>
  <header-com v-if="userAuth"></header-com>

  <main class="bg-bg-main min-h-screen py-14">
    <MessageModal enters-from="top"></MessageModal>
    <router-view :key="$route.fullPath"></router-view>
  </main>
  <FooterCom></FooterCom>
</template>
