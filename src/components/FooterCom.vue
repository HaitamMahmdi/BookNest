<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faInstagram,
  faFacebook,
  faXTwitter,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
</script>
<template>
  <footer class="bg-bg-tertiary text-center text-text-main pt-4">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center">
        <p class="font-semibold">get connected with us on social media</p>
        <div class="flex -center justify-center space-x-4">
          <a href="#" class="text-text-main hover:text-amber-500">
            <FontAwesomeIcon :icon="faInstagram" />
          </a>
          <a href="#" class="text-text-main hover:text-amber-500">
            <FontAwesomeIcon :icon="faFacebook" />
          </a>
          <a href="#" class="text-text-main hover:text-amber-500">
            <FontAwesomeIcon :icon="faXTwitter" />
          </a>
          <a href="#" class="text-text-main hover:text-amber-500">
            <FontAwesomeIcon :icon="faTelegram" />
          </a>
        </div>
      </div>
    </div>
    <div class="bg-bg-main mt-4 py-2">
      <p class="text-sm">&copy; 2024 BookNest. All rights reserved.</p>
    </div>
  </footer>
</template>
