<script setup>
import { ref, computed, watch, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
// icons
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faStar,
  faBook,
  faBookmark,
  faPenToSquare,
  faHeart as faHeartSolid,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  faShareFromSquare,
  faHeart as faHeartRegular,
} from "@fortawesome/free-regular-svg-icons";
// components
import BookCardCom from "@/components/BookCard/BookCardCom.vue";
import ReviewBoxCom from "../components/ReviewBoxCom.vue";
import AddReviewCom from "../components/AddReviewCom.vue";
import BookProgressCom from "../components/BookProgressCom.vue";
import AddNewShelfCom from "../components/BookCard/AddNewShelfCom.vue";
import ShowShelfsCom from "../components/BookCard/ShowShelfsCom.vue";
import LoadingCom from "../components/LoadingCom.vue";
// store
import { useUserBooks } from "../stores/userBooks";
import { useUserAuth } from "../stores/userAuth";
// composables
import { useScrollLock } from "../composables/useScrollControl";
import { useClickOutside } from "@/composables/useClickOutside";
import OptionsCom from "../components/OptionsCom.vue";

const { lock, unlock } = useScrollLock();
const userBooks = useUserBooks();
const userAuth = useUserAuth();
const router = useRouter();
const book = ref(null);

const thoughts = computed(() => userBooks.reading.find((currbook) => currbook.id === book.value?.id))
const isFinisedBook = computed(() => userBooks.isFinisedBook(book.value?.id))


const userReview = computed(() => {
  return userBooks.reviews.find((review) => review.bookID === book.value?.id);
  return null;
});
(async () => {
  const resp = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${router.currentRoute.value.params.id}`,
  );
  let data = await resp.json();
  book.value = data;
  return;
})();
const addReviewCom = ref(null);
const toggleButton = useTemplateRef("toggleButton");
const showAddReviewCom = ref(false);
const openModal = () => {
  showAddReviewCom.value = true;
  lock();
};

const closeModal = () => {
  showAddReviewCom.value = false;
  unlock();
};

/* click outside closes modal */
useClickOutside(addReviewCom, () => {
  if (showAddReviewCom.value) closeModal();
});

/* toggle button */
const toggleAddReviewCom = () => {
  if (showAddReviewCom.value) closeModal();
  else openModal();
};

const categories = computed(() => {
  if (!book.value || !book.value.volumeInfo.categories) return [];

  const newCategories = book.value.volumeInfo.categories.flatMap((category) =>
    category.split("/"),
  );
  return [...new Set(newCategories.map((cat) => cat.trim()))];
});
const similarBooks = ref([]);

watch(
  () => book.value,
  (newVal) => {
    if (newVal) {

      document.title = `${newVal.volumeInfo.title} - BookNest`;
      if (categories.value.length) {
        (async () => {
          const resp = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=subject:${categories.value[0]}&orderBy=relevance&langRestrict=en&maxResults=20`,
          );

          let data = await resp.json();
          similarBooks.value = data.items;
          return;
        })();
      }
    }
  },
);


const showShelfs = ref(false)
const showAddNewShelfCom = ref(false)
</script>
<template>
  <div v-if="!book" class="w-full h-screen">
    <LoadingCom></LoadingCom>
  </div>
  <div v-if="book">
    <div class="container min-h-screen mx-auto py-10 text-text-main">
      <article class="grid grid-cols-[1fr_2fr] max-md:grid-cols-1">
        <div class="px-4 relative max-md:flex flex-wrap max-md:justify-center gap-x-4 max-md:mb-10">
          <div class=" relative">
            <OptionsCom :show-delete="false" :show-edit="false"
              :container-class="`absolute! top-2  flex items-center justify-center rounded-full right-2`"
              :showFinish="false" :showHide="false"
              button-class="hover:bg-Shark bg-Shark/70 w-10! focus:bg-Shark aspect-square rounded-full"
              :options-list-style="`right-0`">

            </OptionsCom>
            <img class="w-full max-xs:w-full! max-lg:w-60 lg:h-150" :src="book?.volumeInfo?.imageLinks?.thumbnail"
              :alt="book?.volumeInfo.title" />

          </div>
          <div class="max-xs:w-full max-lg:w-60">
            <button
              @click="userBooks.isFinisedBook(book?.id) ? userBooks.deleteFinishedBook(book.id) : userBooks.addToFinishedBooks(book?.id)"
              :class="[userBooks.isFinisedBook(book?.id) ? 'text-green-400 bg-white font-bold  ' : 'text-text-main bg-green-400 font-semibold']"
              class="lg:text-2xl text-sm cursor-pointer   px-2 py-2 rounded-md mt-4 w-full">
              <div v-if="!userBooks.isFinisedBook(book?.id)" class="max-w-55 flex items-center justify-between mx-auto">
                <p>mark as read</p>
                <FontAwesomeIcon :icon="faBook" />
              </div>
              <div v-else class="max-w-55 flex items-center justify-between mx-auto">
                <p class="text-lg">you'v finished this book</p>
              </div>
            </button>
            <button
              @click="userBooks.isFavorite(book?.id) ? userBooks.removeFromFavorites(book?.id) : userBooks.addToFavorites(book)"
              :class="[userBooks.isFavorite(book?.id) ? 'text-error bg-white   ' : 'text-text-main bg-error']"
              class="lg:text-2xl text-sm cursor-pointer font-semibold  px-2 py-2 rounded-md mt-4 w-full">
              <div v-if="!userBooks.isFavorite(book.id)" class="max-w-55  flex items-center justify-between mx-auto">
                <p>add to favorites</p>
                <font-awesome-icon :icon="faHeartSolid" class="" />
              </div>
              <div v-else class="max-w-55 flex items-center justify-between  mx-auto">
                <p class=" text-lg mx-auto font-bold">One of your favorites</p>
                <FontAwesomeIcon :icon="faHeartSolid" />
              </div>
            </button>
            <button @click="showShelfs = !showShelfs"
              class="lg:text-2xl relative bg-neutral-800 text-sm cursor-pointer font-semibold text-text-main p-2 rounded-md mt-4 w-full">
              <div v-if="!userBooks.isInShelfGetter(null, book.id)"
                class="max-w-55 flex items-center justify-between mx-auto">
                <p>add to shelf</p>
                <FontAwesomeIcon :icon="faBookmark" />
              </div>
              <div v-else class="max-w-55 flex items-center justify-center gap-x-2 mx-auto">
                <p class="text-lg">On shelf</p>
                <FontAwesomeIcon class=" text-star" :icon="faBookmark" />
              </div>
              <ShowShelfsCom v-if="showShelfs" :class="`w-full text-lg`" @closeShelfsCom="showShelfs = false"
                @openAddNewShelfCom="showAddNewShelfCom = true" :book="book"></ShowShelfsCom>
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
              <div class="flex max-sm:w-fit ml-2" v-for="(author, index) in book?.volumeInfo.authors" :key="author">
                <img class="w-7 h-7 rounded-full mr-1" :src="`/assets/authors/author${index ? index : ''}.webp`"
                  :alt="author" />
                <p class="text-[14px]">{{ author }}</p>
              </div>
            </li>

            <li class="mt-5 flex flex-wrap">
              <p class="font-bold text-textLg">SubTitle :</p>
              <p class="ml-2 max-sm:ml-0">
                {{
                  book.volumeInfo.subtitle ||
                  ` Lorem ipsum dolor sit amet consectetur adipisicing elre vel error inventore nobis, totam
                aspernaturexpedita, magnam nihils.`
                }}
              </p>
            </li>

            <li class="mt-5">
              <p class="font-bold text-textLg">description :</p>
              <p v-html="book.volumeInfo?.description" class="ml-2 max-sm:ml-0"></p>
            </li>
            <li></li>
            <li v-if="categories.length">
              <p class="font-bold text-textLg">Categories :</p>
              <p class="ml-2 font-normal text-[1rem]">
                {{ categories.join(" || ") }}
              </p>
            </li>
            <li class="mt-5 flex items-center max-sm:w-fit max-sm:mx-auto max-sm:mt-4">
              <FontAwesomeIcon class="text-star" v-for="star in Number.isInteger(book.volumeInfo.averageRating)
                ? book.volumeInfo.averageRating
                : 3 || 2" :key="star" :icon="faStar" />
              <p class="ml-2">
                Rated by
                <span class="font-bold">{{ book.volumeInfo.ratingsCount || 2 }} users</span>
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
    <section class="bg-bg-secondary py-10">
      <div class="container mx-auto px-4">
        <BookProgressCom :pagesCount="book.volumeInfo.pageCount"
          :currentPage="thoughts?.reading[thoughts?.reading.length - 1]?.progrees" :bookID="book.id"
          :isFinisedBook="isFinisedBook" :thoughts="thoughts"></BookProgressCom>
      </div>
    </section>
    <section class="mt-20 py-10 bg-Shark">
      <div class="container mx-auto sm:px-4">
        <h3 class="w-fit text-white text-4xl max-sm:mx-auto pt-8 font-bold">
          users reviews
          <span class="text-2xl text-[#888] font-normal">({{ book.volumeInfo.ratingsCount || 0 }})</span>
        </h3>
        <button ref="toggleButton" @click="toggleAddReviewCom" id="part" v-if="!userReview"
          class="ml-auto flex items-center cursor-pointer group text-text-main max-sm:mt-4">
          <FontAwesomeIcon id="part" class="mr-2" :icon="faPenToSquare" />
          <p id="part" class="group-hover:underline">add your review</p>
        </button>
        <AddReviewCom :bookID="book.id" v-if="showAddReviewCom" ref="addReviewCom" @submitReview="closeModal" />

        <div class="slider flex overflow-x-scroll w-full mt-8 mx-auto">
          <ReviewBoxCom v-if="userReview" :class="`min-w-[300px] bg-blue-600 mx-auto `" :obj="{
            name: `${userAuth.displayName || 'user'}`,
            profileImg: `https://picsum.photos/200/300?random=1`,
            rating: userReview.rating,
            review: userReview.body,
          }" :reviewID="userReview.id" :isUserReview="true" />
          <ReviewBoxCom v-if="book.volumeInfo.ratingsCount" v-for="(review, index) in book.volumeInfo.ratingsCount"
            :key="index" :class="`min-w-[300px] mx-2`" :obj="{
              name: `user${index + 1}`,
              profileImg: `https://picsum.photos/200/300?random=${index + 1}`,
              rating: book.volumeInfo.averageRating,
              review: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt earum reiciendis voluptate velit error inventore nobis,  totam aspernatur expedita, magnam nihil.`,
            }" />

          <div v-else-if="!userReview && !book.volumeInfo.ratingsCount"
            class="bg-bg-secondary md:w-2xl mx-auto px-4 py-4 rounded-lg relative text-white">
            <p class="font-bold text-center mt-4 text-text-main text-2xl">
              add your review
            </p>
            <button @click="toggleAddReviewCom" id="part"
              class="px-4 py-2 cursor-pointer bg-primary mx-auto block bg-bg-main mt-10 text-white rounded-lg hover:bg-blue-600">
              add new review
            </button>
          </div>
        </div>
      </div>
    </section>
    <section v-if="similarBooks.length" class="py-10 mt-40 mx-auto bg-Shark">
      <div class="container mx-auto px-4">
        <h3 class="w-fit text-white text-4xl max-sm:mx-auto pt-8 font-bold">
          similar books :
        </h3>
        <div class="flex max-w-316 mx-auto snap-center slider w-full overflow-x-scroll gap-x-4 my-8">
          <BookCardCom :class="` min-w-45 text-lg`" v-for="book in similarBooks" :key="book" :book="book" />
        </div>
      </div>
    </section>
    <AddNewShelfCom @close="showAddNewShelfCom = false" v-if="showAddNewShelfCom"></AddNewShelfCom>
  </div>

</template>
<style scoped>
.slider {
  scrollbar-width: none;
}
</style>
