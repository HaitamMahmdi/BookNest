<script setup>
import { computed, watch } from "vue";
import { useUserAuth } from "./stores/userAuth";
const userAuth = useUserAuth();
userAuth.init();
</script>

<template>
  <main class="bg-bg-main">
    <router-view></router-view>
  </main>
</template>
