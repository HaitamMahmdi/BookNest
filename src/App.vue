<script setup>
import { onMounted, onUnmounted } from "vue";
import HeaderCom from "./components/HeaderCom.vue";
import { useUserAuth } from "./stores/userAuth";
import { useUserBooks } from "./stores/userBooks";
import FooterCom from '@/components/FooterCom.vue'

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

  <main class="bg-bg-main min-h-screen py-20">
    <router-view :key="$route.fullPath"></router-view>
  </main>
  <FooterCom></FooterCom>
</template>
