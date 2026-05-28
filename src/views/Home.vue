<script setup>
import { onUnmounted, ref } from "vue";
import BookCardCom from "@/components/bookCard/BookCardCom.vue";
import { faDragon, faRobot, faGhost, faLandmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useUserBooks } from "../stores/userBooks";
import LoadingCom from "../components/LoadingCom.vue";
const userBooks = useUserBooks();
const books = ref({});

(async () => {
  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const resp = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=subject:fantasy&orderBy=newest&langRestrict=en&maxResults=40&key=${apiKey}`
  );
  let data = await resp.json();
  books.value.fantasy = data.items;
  return;
})();


const filterBooks = ref(null);
const bookDetail = ref(null);
</script>
<template>
  <LoadingCom v-if="!books"></LoadingCom>
  <div v-if="books">
    <section class="min-h-screen  mt-10">
      <ul class=" text-text-main flex flex-wrap h-fit gap-6 mb-8 w-full select-none justify-center  max-sm:text-sm">
        <li @click="() => filterBooks === 'fantasy' ? filterBooks = '' : filterBooks = 'fantasy'"
          :class="[filterBooks === 'fantasy' ? 'bg-white! text-text-secondary!' : '']"
          class=" flex h-fit items-center px-4 py-1 border rounded-full cursor-pointer      ">
          <FontAwesomeIcon class="mr-2" :icon="faDragon" />
          <p>fantasy</p>
        </li>
        <li @click="() => filterBooks === 'science_fiction' ? filterBooks = '' : filterBooks = 'science_fiction'"
          :class="[filterBooks === 'science_fiction' ? 'bg-white! text-text-secondary!' : '']"
          class=" flex  h-fit items-center px-4 py-1 border rounded-full cursor-pointer ">
          <FontAwesomeIcon class="mr-2" :icon="faRobot" />
          <p>science fiction</p>
        </li>
        <li @click="() => filterBooks === 'mystery' ? filterBooks = '' : filterBooks = 'mystery'"
          :class="[filterBooks === 'mystery' ? 'bg-white! text-text-secondary!' : '']"
          class=" flex  h-fit items-center px-4 py-1 border rounded-full cursor-pointer ">
          <FontAwesomeIcon class="mr-2" :icon="faGhost" />
          <p>mystery</p>
        </li>
        <li @click="() => filterBooks === 'history' ? filterBooks = '' : filterBooks = 'history'"
          :class="[filterBooks === 'history' ? 'bg-white! text-text-secondary!' : '']"
          class=" flex  h-fit items-center px-4 py-1 border rounded-full cursor-pointer ">
          <FontAwesomeIcon class="mr-2" :icon="faLandmark" />
          <p>history</p>
        </li>
      </ul>
      <div class="flex flex-wrap px-8 w-full gap-4 justify-center">
        <BookCardCom v-if="books" v-for="book in books.fantasy" :key="book.id" :book="book">
        </BookCardCom>

      </div>


    </section>
  </div>

</template>
