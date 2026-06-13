<script setup>
import { onMounted, onUnmounted } from "vue";
import HeaderCom from "@/components/HeaderCom.vue";
import { useUserAuth } from "@/stores/userAuth";
import { useUserBooks } from "@/stores/userBooks";
import FooterCom from '@/components/FooterCom.vue'
import MessageModal from "@/components/modals/MessageModal.vue";
import { useUiStore } from "@/stores/UiStore";
import AreYouSureModal from "./components/modals/AreYouSureModal.vue";
const uiStore = useUiStore();
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
  <header-com v-if="userAuth.user"></header-com>
  <main class="bg-bg-main pt-14 min-h-screen ">
    <MessageModal enters-from="top"></MessageModal>
    <AreYouSureModal v-if="uiStore.areYouSureModal.show"></AreYouSureModal>
    <router-view :key="$route.fullPath"></router-view>
  </main>
  <FooterCom></FooterCom>
</template>
