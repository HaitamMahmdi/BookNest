<script setup>
import HeaderCom from "./components/HeaderCom.vue";
import { useUserAuth } from "./stores/userAuth";
const userAuth = useUserAuth();
userAuth.init();
</script>
<template>
  <header-com v-if="userAuth.user"></header-com>

  <main class="bg-bg-main">
    <router-view></router-view>
  </main>
</template>
