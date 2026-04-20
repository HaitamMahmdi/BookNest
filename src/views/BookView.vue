<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStar, faBook, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { useUserBooks } from "../stores/userBooks";
const userBooks = useUserBooks();
import {
  faShareFromSquare,
  faHeart as faHeartRegular,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import BookCardCom from "../components/BookCard/BookCardCom.vue";
const router = useRouter();
const book = ref(null);
(async () => {
  const resp = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${router.currentRoute.value.params.id}`,
  );
  let data = await resp.json();
  book.value = data;
  console.log(data);

  return;
})();
const categories = computed(() => {
  if (!book.value || !book.value.volumeInfo.categories) return [];

  const newCategories = book.value.volumeInfo.categories.flatMap((category) =>
    category.split("/"),
  );
  return [...new Set(newCategories.map((cat) => cat.trim()))];
});
</script>
<template>
  <div class="container min-h-screen mx-auto py-10 text-text-main">
    <article class="grid grid-cols-[1fr_2fr] max-md:grid-cols-1">
      <div
        class="px-4 max-md:flex flex-wrap max-md:justify-between max-md:mb-10"
      >
        <img
          class="w-full max-xs:w-full! max-lg:w-60 lg:h-150"
          :src="book?.volumeInfo.imageLinks?.thumbnail"
          :alt="book?.volumeInfo.title"
        />
        <div class="max-xs:w-full">
          <button
            class="lg:text-2xl text-sm cursor-pointer font-semibold text-text-main bg-green-400 px-2 py-2 rounded-md mt-4 w-full"
          >
            <div class="max-w-55 flex items-center justify-between mx-auto">
              <p>mark as read</p>
              <FontAwesomeIcon :icon="faBook" />
            </div>
          </button>
          <button
            class="lg:text-2xl text-sm cursor-pointer font-semibold text-text-main bg-error px-2 py-2 rounded-md mt-4 w-full"
          >
            <div class="max-w-55 flex items-center justify-between mx-auto">
              <p>add to favorites</p>
              <font-awesome-icon :icon="faHeartSolid" class="text-text-main" />
            </div>
          </button>
          <button
            class="lg:text-2xl bg-neutral-800 text-sm cursor-pointer font-semibold text-text-main p-2 rounded-md mt-4 w-full"
          >
            <div class="max-w-55 flex items-center justify-between mx-auto">
              <p>add to shelf</p>
              <FontAwesomeIcon :icon="faBookmark" />
            </div>
          </button>
        </div>
      </div>
      <div class="main px-4">
        <h1 class="text-3xl font-bold mb-4">
          {{ book.volumeInfo.title }}
        </h1>
        <ul class="ml-4">
          <li class="flex items-start font-semibold text-textLg">
            <h3>authors :</h3>
            <div
              class="flex max-sm:w-fit ml-2"
              v-for="(author, index) in book?.volumeInfo.authors"
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

          <li class="mt-5 flex flex-wrap">
            <p class="font-bold text-textLg">SubTitle :</p>
            <p class="ml-2 max-sm:ml-0">
              {{
                book.volumeInfo.subtitle ||
                " Lorem ipsum dolor sit amet consectetur adipisicing elre vel error inventore nobis,  totam aspernatur expedita, magnam nihils."
              }}
            </p>
          </li>

          <li class="mt-5">
            <p class="font-bold text-textLg">description :</p>
            <p
              v-html="book.volumeInfo?.description"
              class="ml-2 max-sm:ml-0"
            ></p>
          </li>
          <li></li>
          <l mt-4i>
            <p class="font-bold text-textLg">Categories :</p>
            <p class="ml-2 font-normal text-[1rem]">
              {{ categories.join(" || ") }}
            </p>
          </l>
          <li
            class="mt-5 flex items-center max-sm:w-fit max-sm:mx-auto max-sm:mt-4"
          >
            <FontAwesomeIcon
              class="text-star"
              v-for="star in Number.isInteger(book.volumeInfo.averageRating)
                ? book.volumeInfo.averageRating
                : 3 || 2"
              :key="star"
              :icon="faStar"
            />
            <p class="ml-2">
              Rated by
              <span class="font-bold"
                >{{ book.volumeInfo.ratingsCount || 2 }} users</span
              >
            </p>
          </li>
          <li class="flex flex-wrap mt-4">
            <p class="font-bold text-textLg">pageCount :</p>
            <p class="ml-2 font-normal text-[1rem]">
              {{ book.volumeInfo.pageCount }}
            </p>
          </li>

          <li class="flex flex-wrap mt-4">
            <p class="font-bold text-textLg">publisher :</p>
            <p class="ml-2 font-normal text-[1rem]">
              {{ book.volumeInfo.publisher || "Unknown" }}
            </p>
          </li>
          <li class="flex flex-wrap mt-4">
            <p class="font-bold text-textLg">publishe Date :</p>
            <p class="ml-2 font-normal text-[1rem]">
              {{ book.volumeInfo.publishedDate || "Unknown" }}
            </p>
          </li>
          <li class="flex flex-wrap mt-4">
            <p class="font-bold text-textLg">language :</p>
            <p class="ml-2 font-normal text-[1rem]">
              {{ book.volumeInfo.language }}
            </p>
          </li>
        </ul>
      </div>
    </article>
  </div>
</template>
