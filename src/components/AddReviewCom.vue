<script setup>
import { onMounted, onUnmounted, reactive, ref, useTemplateRef } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const stars = useTemplateRef("star");

const changeStare = (e) => {
  console.log(e);
  const starId = e.target.id;
  const starIndex = parseInt(starId.replace("star", ""));
  for (let i = 0; i < stars.value.length; i++) {
    if (i <= starIndex) {
      stars.value[i]?.$el.classList.add("text-yellow-400");
    } else {
      stars.value[i]?.$el.classList.remove("text-yellow-400");
    }
  }
};
</script>
<template>
  <form
  id="reviewCom"
    @submit.prevent
    class="w-3/4 text-text-main bg-Shark fixed z-20 p-4 rounded-lg shadow-max top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <div class="flex items-center gap-x-px mb-2">
      <p class="mr-4 text-lg">add star count:</p>
      <FontAwesomeIcon
        @mouseenter="changeStare"
        v-for="(star, index) in 5"
        :key="star"
        ref="star"
        :id="`star${index}`"
        class="cursor-pointer"
        :icon="faStar"
      />
    </div>
    <div>
      <label for="review" class="text-lg mb-2 block">title:</label>
      <input
        type="text"
        id="review"
        placeholder="title"
        class="w-full p-2 bg-bg-main rounded mb-4 border border-transparent focus:border-text-main"
      />
    </div>
    <div>
      <label for="review-body" class="text-lg mb-2 block">Your Review:</label>
      <textarea
        type="text"
        id="review-body"
        placeholder="Write your review here..."
        class="w-full p-2 bg-bg-main rounded mb-4 border border-transparent max-h-36 min-h-36 focus:border-text-main"
      >
      </textarea>
    </div>
    <input
      type="submit"
      class="bg-green-400 cursor-pointer text-text-main px-4 py-2 rounded hover:bg-green-500 transition-colors"
    >
    </input>
  </form>
</template>
