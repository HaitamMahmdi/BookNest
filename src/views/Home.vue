<script setup>
import { ref } from "vue";
import BookCardCom from "../components/bookCard/BookCardCom.vue";
import BookInfoCardCom from "../components/bookCard/BookInfoCardCom.vue";
const books = ref(null);
(async () => {
  const resp = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=subject:fantasy&orderBy=newest&langRestrict=en&maxResults=40
`
  );
  let data = await resp.json();
  books.value = data.items;

  return;
})();

const bookDetail = ref(null);
</script>
<template>
  <div class="grid lg:grid-cols-[320px_1fr]">
    <section class="bg-bg-secondary min-h-screen max-lg:absolute"></section>
    <section class="mt-8 pt-10 gap-x-50 flex flex-wrap">
      <div class="flex flex-wrap max-w-240 gap-4 justify-center">
        <BookCardCom
          v-if="books"
          v-for="book in books"
          :key="book.id"
          :book-obj="book"
          @showInfos="(bookObj) => (bookDetail = bookObj)"
        >
        </BookCardCom>
      </div>
      <div v-if="false" class="w-80 h-200 pt-8 bg-bg-tertiary rounded-2xl">
        <div class="w-40 h-62 mx-auto" v-if="bookDetail">
          <img
            class="w-full h-full"
            :src="bookDetail.volumeInfo.imageLinks?.thumbnail"
            :alt="bookDetail.volumeInfo.title"
          />
        </div>
        <ul>
          <li class="text-center font-semibold">
            <p>{{ bookDetail.volumeInfo.title }}</p>
            <p>{{ bookDetail.volumeInfo?.subtitle }}</p>
          </li>
        </ul>
      </div>
      <BookInfoCardCom
        @close="() => (bookDetail = null)"
        v-if="bookDetail"
        :book-info="bookDetail"
      ></BookInfoCardCom>
    </section>
  </div>
</template>
