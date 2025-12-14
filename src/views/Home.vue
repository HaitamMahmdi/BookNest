<script setup>
import { ref } from "vue";
import BookCardCom from "../components/bookCard/BookCardCom.vue";
import BookInfoCardCom from "../components/bookCard/BookInfoCardCom.vue";

const books = ref(null);
(async () => {
  const resp = await fetch(
    " https://www.googleapis.com/books/v1/volumes?q=subject:Science+Fiction&maxResults=10"
  );
  let data = await resp.json();
  books.value = data.items;

  return;
})();
const bookDetail = ref(null);
const postion = ref("");
</script>
<template>
  <div class="grid lg:grid-cols-[320px_minmax(160px,1280px)_320px]">
    <section class="bg-bg-secondary min-h-screen max-lg:absolute">left</section>
    <section class="">
      <div
        class="grid grid-cols-[repeat(auto-fit,minmax(160px,160px))] gap-4 justify-center py-10"
      >
        <BookCardCom
          @click="(e) => (postion = e.clientY)"
          v-if="books"
          v-for="book in books"
          :key="book.id"
          :book-obj="book"
          @showInfos="(bookObj) => (bookDetail = bookObj)"
        >
        </BookCardCom>
        {{ postion }}
        <BookInfoCardCom
          @close="() => (bookDetail = null)"
          v-if="bookDetail"
          :book-info="bookDetail"
          :postion-y="postion"
        ></BookInfoCardCom>
      </div>
    </section>

    <section class="bg-bg-secondary max-lg:hidden">right</section>
  </div>
</template>
