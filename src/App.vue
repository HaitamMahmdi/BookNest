<script setup>
import { onMounted, onUnmounted } from "vue";
import HeaderCom from "./components/HeaderCom.vue";
import { useUserAuth } from "./stores/userAuth";
import { useUserBooks } from "./stores/userBooks";

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

  <main class="bg-bg-main">
    <router-view></router-view>
  </main>
</template>
