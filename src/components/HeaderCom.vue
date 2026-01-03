<script setup>
import { ref, onMounted, onUnmounted } from "vue";
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
const showDropdown = ref(false);
const profile = ref(null);

const handleClickOutside = (e) => {
  if (!profile.value?.contains(e.target)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <section
    class="bg-[#375557] w-full h-14 flex flex-wrap justify-center items-center"
  >
    <SearchbarCom :prop-class="'mr-4'"></SearchbarCom>
    <button
      ref="profile"
      @click="showDropdown = !showDropdown"
      class="block h-full relative cursor-pointer"
    >
      <img
        class="w-11 aspect-square rounded-full"
        src="/assets/authors/author4.webp"
        alt="Profile"
      />
      <ul
        v-if="showDropdown"
        class="absolute bg-[#354445] z-50 text-text-main top-full"
      >
        <li
          class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2"
        >
          <FontAwesomeIcon :icon="faHouse" />
          <p>View Profile</p>
        </li>
        <li
          class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2"
        >
          <FontAwesomeIcon :icon="faUser" />
          <p>View Profile</p>
        </li>
        <li
          class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2"
        >
          <FontAwesomeIcon :icon="faBookmark" />
          <p>Your Shelfs</p>
        </li>
        <li
          class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2"
        >
          <FontAwesomeIcon :icon="faTrophy" />
          <p>Achievements</p>
        </li>
        <li class="w-full h-0.5 bg-[#dddd]"></li>
        <li
          class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2"
        >
          <FontAwesomeIcon :icon="faShieldHalved" />
          <p>Premium</p>
        </li>

        <li
          class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2"
        >
          <FontAwesomeIcon :icon="faGears" />
          <p>Settings</p>
        </li>
        <li class="w-full h-0.5 bg-[#dddd]"></li>
        <li
          class="flex items-center w-75 hover:pl-8 hover:bg-bg-secondary transform duration-100 pl-4 pr-10 py-4 font-semibold gap-x-2"
        >
          <FontAwesomeIcon :icon="faInfo" />
          <p>Help</p>
        </li>
      </ul>
    </button>
  </section>
</template>
