<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import SearchbarCom from "./SearchbarCom.vue";
import {
  faUser,
  faBookmark,
  faHouse,
} from "@fortawesome/free-regular-svg-icons";
import {
  faTrophy,
  faShieldHalved,
  faGears,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useUserAuth } from "@/stores/userAuth";
import { useUserStore } from "@/stores/userStore";
const showDropdown = ref(false);
const user = useUserAuth()
const userStore = useUserStore()
const userID = computed(() => user.user?.uid)
const profile = ref(null);
const handleClick = (e) => {
  if (!showDropdown.value) {
    showDropdown.value = true;
    document.addEventListener("click", handleClick);
    return;
  }
  if (!profile.value?.contains(e?.target)) {
    console.log(profile.value?.contains(e?.target));
    showDropdown.value = false;
    document.removeEventListener("click", handleClick);
  }
};
</script>
<template>
  <header class="bg-[#375557] fixed z-40 sm:px-4 w-full h-14 flex flex-wrap justify-center items-center">
    <div class="max-w-180 grow px-4 max-sm:hidden">
      <SearchbarCom :prop-class="'mr-4'"></SearchbarCom>
    </div>
    <button ref="profile" class="block h-full max-sm:w-full pl-4 relative cursor-pointer">
      <img @click.self="handleClick($event)" class="w-11 aspect-square rounded-full"
        :src="userStore.profileImgURL?.url ? userStore.profileImgURL?.url : `https://www.gravatar.com/avatar/?d=mp`"
        alt="Profile" />
      <ul v-if="showDropdown"
        class="absolute bg-[#354445] z-50 text-text-main top-full right-0 max-sm:left-0 max-sm:w-full">
        <li class="flex items-center justify-center py-4 sm:hidden">
          <SearchbarCom></SearchbarCom>
        </li>
        <li>
          <RouterLink :to="{ name: 'Home' }"
            class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2">
            <FontAwesomeIcon :icon="faHouse" />
            <p>Home</p>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2"
            v-if="userID" :to="{ name: 'ProfileMain', params: { id: userID } }">
            <FontAwesomeIcon :icon="faUser" />
            <p>View Profile</p>
          </RouterLink>
        </li>
        <li
          class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2">
          <FontAwesomeIcon :icon="faBookmark" />
          <p>Your shelves</p>
        </li>
        <li
          class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2">
          <FontAwesomeIcon :icon="faTrophy" />
          <p>Achievements</p>
        </li>
        <li class="w-full h-0.5 bg-[#dddd]"></li>
        <li
          class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2">
          <FontAwesomeIcon :icon="faShieldHalved" />
          <p>Premium</p>
        </li>

        <li
          class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2">
          <FontAwesomeIcon :icon="faGears" />
          <p>Settings</p>
        </li>
        <li class="w-full h-0.5 bg-[#dddd]"></li>
        <li
          class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2">
          <FontAwesomeIcon :icon="faInfo" />
          <p>Help</p>
        </li>
      </ul>
    </button>
  </header>
</template>
