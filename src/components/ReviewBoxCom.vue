<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faStar,
  faReply,
  faHeart,
  faEllipsisVertical,
  faBullhorn,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  obj: Object,
});

const isVisible = ref(false);
const articleRef = ref(null);

const toggleOptions = () => {
  isVisible.value = !isVisible.value;
};

const handleClickOutside = (event) => {
  if (articleRef.value && !articleRef.value.contains(event.target)) {
    isVisible.value = false;
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
  <article
    ref="articleRef"
    class="bg-bg-secondary max-w-2xl px-4 py-4 rounded-lg relative text-white"
  >
    <div class="flex items-center gap-x-1 relative pb-1 border-b border-white">
      <img
        :src="obj.profileImg"
        :alt="obj.name"
        class="w-10 h-10 rounded-full"
      />
      <div>
        <p class="ml-2 font-semibold text-sm">{{ obj.name }}</p>

        <FontAwesomeIcon
          class="text-star text-sm"
          v-for="star in Number.isInteger(obj.rating) ? obj.rating : 3 || 2"
          :key="star"
          :icon="faStar"
        />
      </div>
      <button
        @click="toggleOptions"
        class="absolute right-2 top-2 text-gray-400 hover:text-white cursor-pointer"
      >
        <FontAwesomeIcon :icon="faEllipsisVertical" />
      </button>
      <div
        v-show="isVisible"
        class="absolute right-2 top-10 bg-bg-main rounded-md shadow-lg p-2"
      >
        <button
          class="flex items-center gap-x-1 cursor-pointer text-error py-1 px-4 rounded-md hover:bg-error/20"
        >
          <FontAwesomeIcon :icon="faBullhorn" />
          <span>Report</span>
        </button>
        <button
          class="flex w-full items-center gap-x-1 cursor-pointer text-gray-400 py-1 px-4 rounded-md hover:bg-gray-400/20"
        >
          <FontAwesomeIcon :icon="faEyeSlash" />
          <span>Hide</span>
        </button>
      </div>
    </div>
    <p class="mt-2">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt earum
      quibusdam esse recusandae id minus repudiandae, magni modi obcaecati
      animi, fuga alias. Voluptas impedit accusamus eos in dolore excepturi
      consequuntur!
    </p>
    <div class="mt-4 flex items-center justify-between">
      <p>{{ obj.reviewDate }}</p>
      <div class="flex items-center justify-between">
        <button class="flex items-center gap-x-1 cursor-pointer">
          <FontAwesomeIcon :icon="faReply" />
          <span>Reply</span>
        </button>
        <div class="ml-4">
          <button class="flex items-center gap-x-1 cursor-pointer">
            <FontAwesomeIcon :icon="faHeart" />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
