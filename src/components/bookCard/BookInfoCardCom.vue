<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  faBookmark,
  faShareFromSquare,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const props = defineProps({
  bookInfo: Object,
  postionY: String,
});
console.log(props.postionY);
const bodyHeight = ref(0);
let observer;

const updateHeight = () => {
  bodyHeight.value = document.body.offsetHeight;
};

onMounted(() => {
  // initial height
  updateHeight();

  // Observe body for changes
  observer = new ResizeObserver(() => {
    updateHeight();
  });
  observer.observe(document.body);

  // Optional: also update on window resize
  window.addEventListener("resize", updateHeight);
});

onBeforeUnmount(() => {
  observer.disconnect();
  window.removeEventListener("resize", updateHeight);
});

const show = ref(true);
</script>
<template>
  <div
    v-if="show"
    :style="{ height: bodyHeight + 'px' }"
    @click.self="$emit('close')"
    class="absolute bg-[#000000b5] w-full h-full left-0 top-0 flex justify-center"
  >
    <div
      :style="{ top: props.postionY / 2 + 'px' }"
      v-if="props.bookInfo"
      :id="props.bookInfo.id"
      class="bg-bg-white flex h-fit max-sm:flex-wrap max-sm:justify-center max-sm:text-center p-4 max-sm:px-0 relative"
    >
      <div
        class="min-w-40 sm:border-r border-[#ddd] pr-4 max-sm:px-0 flex flex-col justify-between"
      >
        <div>
          <img
            draggable="false"
            class="w-40 h-64 mb-4"
            :src="props.bookInfo.volumeInfo.imageLinks?.thumbnail"
            :alt="props.bookInfo.volumeInfo.title"
          />
        </div>
        <div class="flex flex-wrap items-center justify-between">
          <div>
            <FontAwesomeIcon class="text-2xl" :icon="faBookmark" />
          </div>
          <div>
            <img class="w-7" src="/assets/icons/shelf.svg" alt="add to shelf" />
          </div>
          <div>
            <FontAwesomeIcon class="text-2xl" :icon="faShareFromSquare" />
          </div>
        </div>
      </div>
      <ul class="ml-4 max-sm:mt-4 max-sm:ml-0">
        <li>
          <h2 class="font-bold text-textLg">Title :</h2>
          <h2 class="font-bold ml-2">
            {{ props.bookInfo.volumeInfo.title }}
          </h2>
        </li>

        <li class="mt-5">
          <p class="font-bold text-textLg">SubTitle :</p>
          <p class="max-w-3xl ml-2 max-sm:ml-0">
            {{
              props.bookInfo.volumeInfo.subtitle ||
              " Lorem ipsum dolor sit amet consectetur adipisicing elre vel error inventore nobis,  totam aspernatur expedita, magnam nihil facilis minus natus vero asperiores."
            }}
          </p>
        </li>
        <li>
          <h3 class="font-bold mt-4 text-textLg">authors :</h3>
          <div
            class="flex max-sm:w-fit max-sm:mx-auto max-sm:mt-4 items-center mb-2 ml-2"
            v-for="(author, index) in props.bookInfo.volumeInfo.authors"
            :key="author"
          >
            <img
              class="w-7 h-7 rounded-full mr-1"
              :src="`/assets/authors/author${index ? index : ''}.webp`"
              :alt="author"
            />
            <p class="text-[14px]">{{ author }}</p>
          </div>
        </li>
        <li>
          <p class="font-bold text-textLg mt-4">
            Categories :
            <span class="ml-2 font-normal text-[1rem]">{{
              props.bookInfo.volumeInfo.categories[0]
            }}</span>
          </p>
        </li>
        <li
          class="mt-5 flex items-center max-sm:w-fit max-sm:mx-auto max-sm:mt-4"
        >
          <FontAwesomeIcon
            class="text-star"
            v-for="star in props.bookInfo.volumeInfo.averageRating || 2"
            :key="star"
            :icon="faStar"
          />
          <p class="ml-2">
            Rated by
            <span class="font-bold"
              >{{ props.bookInfo.volumeInfo.ratingsCount || 2 }} users</span
            >
          </p>
        </li>

        <li class="flex flex-wrap gap-y-2 mt-4 max-sm:justify-center">
          <p class="mr-2">
            <span class="font-bold">pageCount : </span>
            {{ props.bookInfo.volumeInfo.pageCount }}
          </p>
          ||
          <p class="mx-2">
            <span class="font-bold">publisher : </span
            >{{ props.bookInfo.volumeInfo.publisher || "Unknown" }}
          </p>
          ||
          <p class="mx-2">
            <span class="font-bold">publishe Date : </span
            >{{ props.bookInfo.volumeInfo.publishedDate || "Unknown" }}
          </p>
          ||
          <p class="ml-2">
            <span class="font-bold">language : </span
            >{{ props.bookInfo.volumeInfo.language }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>
