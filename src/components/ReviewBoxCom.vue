<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faStar,
  faReply,
  faHeart,
  faEllipsisVertical,
  faBullhorn,
  faEyeSlash,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ref, onMounted, onUnmounted } from "vue";
import { useUserBooks } from "../stores/userBooks";
import OptionsCom from "./OptionsCom.vue";

const props = defineProps({
  obj: Object,
  class: String,
  isUserReview: Boolean,
  reviewID: String,
});


const userBooks = useUserBooks();

const hide = ref(false);
</script>
<template>
  <article v-if="!hide" ref="articleRef" :class="class"
    class="bg-bg-secondary flex flex-col min-h-50 max-w-2xl px-4 py-4 rounded-lg relative text-white">
    <div class="flex items-center gap-x-1 relative pb-1 border-b border-white">
      <img :src="obj.profileImg" :alt="obj.name" class="w-10 h-10 rounded-full" />
      <div class="grow">
        <p class="ml-2 font-semibold text-sm">{{ obj.name }}</p>

        <FontAwesomeIcon class="text-star text-sm" v-for="star in Number.isInteger(obj.rating) ? obj.rating : 3 || 2"
          :key="star" :icon="faStar" />
      </div>
      <OptionsCom :options-list-style="`right-0 top-3/6!`" :show-delete="props.isUserReview"
        :show-edit="props.isUserReview" :show-finish="false" :show-report="!props.isUserReview"
        @hide="() => hide = true"></OptionsCom>
    </div>
    <p class="mt-2 grow">
      {{ obj.review }}
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
