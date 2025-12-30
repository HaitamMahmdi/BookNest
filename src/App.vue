<script setup>
import { computed, watch } from "vue";
import { useUserAuth } from "./stores/userAuth";
import HeaderCom from "./components/HeaderCom.vue";
const userAuth = useUserAuth();
userAuth.init();
</script>

<template>
  <header-com></header-com>
  <main class="bg-bg-main">
    <router-view></router-view>
  </main>
</template>
