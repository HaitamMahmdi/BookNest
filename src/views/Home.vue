<script setup>
import { onUnmounted, ref } from "vue";
import BookCardCom from "../components/bookCard/BookCardCom.vue";
import BookInfoCardCom from "../components/bookCard/BookInfoCardCom.vue";
import { faDragon, faRobot, faGhost, faLandmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useUserBooks } from "../stores/userBooks";
 const userBooks = useUserBooks();
const books = ref({});
userBooks.loadUserBooks();
(async () => {
  const resp = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=subject:fantasy&orderBy=newest&langRestrict=en&maxResults=40`
  );
  let data = await resp.json();
  books.value.fantasy = data.items;
  return;
})();

(async () => {
  const resp = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=subject:science_fiction&orderBy=newest&langRestrict=en&maxResults=40
`
  );
  let data = await resp.json();
  books.value.science_fiction = data.items;
  return;
})();

(async () => {
  const resp = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=subject:mystery&orderBy=newest&langRestrict=en&maxResults=40`
  );
  let data = await resp.json();
  books.value.mystery = data.items;
  return;
})();

(async () => {
  const resp = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=subject:history&orderBy=newest&langRestrict=en&maxResults=40`
  );
  let data = await resp.json();
  books.value.history = data.items;
  return;
})();
const fillteredBooks = ref(null);
const bookDetail = ref(null);
onUnmounted(() => {
  userBooks.stopUserBooksListener();
});
</script>
<template>
  <div>
    <section class="pt-10 min-h-screen ">
      <ul class=" text-text-main flex flex-wrap h-fit gap-6 mb-8 w-full select-none justify-center  max-sm:text-sm">
        <li @click="()=> fillteredBooks === 'fantasy' ? fillteredBooks = '' : fillteredBooks = 'fantasy' " :class="[fillteredBooks === 'fantasy' ? 'bg-white! text-text-secondary!' : '']" class=" flex h-fit items-center px-4 py-1 border rounded-full cursor-pointer      "><FontAwesomeIcon class="mr-2" :icon="faDragon" /> <p>fantasy</p></li>
        <li @click="()=> fillteredBooks === 'science_fiction' ? fillteredBooks = '' : fillteredBooks = 'science_fiction'" :class="[fillteredBooks === 'science_fiction' ? 'bg-white! text-text-secondary!' : '']" class=" flex  h-fit items-center px-4 py-1 border rounded-full cursor-pointer "><FontAwesomeIcon class="mr-2" :icon="faRobot" /> <p>science fiction</p></li>
        <li @click="()=> fillteredBooks === 'mystery' ? fillteredBooks = '' : fillteredBooks = 'mystery'" :class="[fillteredBooks === 'mystery' ? 'bg-white! text-text-secondary!' : '']" class=" flex  h-fit items-center px-4 py-1 border rounded-full cursor-pointer "><FontAwesomeIcon class="mr-2" :icon="faGhost" /> <p>mystery</p></li>
        <li @click="()=> fillteredBooks === 'history' ? fillteredBooks = '' : fillteredBooks = 'history'" :class="[fillteredBooks === 'history' ? 'bg-white! text-text-secondary!' : '']" class=" flex  h-fit items-center px-4 py-1 border rounded-full cursor-pointer "><FontAwesomeIcon class="mr-2" :icon="faLandmark" /> <p>history</p></li>
      </ul> 
      <div class="flex flex-wrap px-8 w-full gap-4 justify-center">
        <BookCardCom 
          v-if="books && (!fillteredBooks || fillteredBooks === 'fantasy')"
          v-for="book in books.fantasy"
          :key="book.id"
          :book-obj="book"
          @showInfos="(bookObj) => (bookDetail = bookObj)"
        >
        </BookCardCom>
         <BookCardCom
          v-if="books && (!fillteredBooks || fillteredBooks === 'science_fiction')"
          v-for="book in books.science_fiction"
          :key="book.id"
          :book-obj="book"
          @showInfos="(bookObj) => (bookDetail = bookObj)"
        >
        </BookCardCom>
         <BookCardCom
          v-if="books && (!fillteredBooks || fillteredBooks === 'mystery')"
          v-for="book in books.mystery"
          :key="book.id"
          :book-obj="book"
          @showInfos="(bookObj) => (bookDetail = bookObj)"
        >
        </BookCardCom>
          <BookCardCom
            v-if="books && (!fillteredBooks || fillteredBooks === 'history')"
            v-for="book in books.history"
            :key="book.id"
            :book-obj="book"
            @showInfos="(bookObj) => (bookDetail = bookObj)"
             </BookCardCom>
      </div>
     
      <BookInfoCardCom
        @close="() => (bookDetail = null)"
        v-if="bookDetail && userBooks"
        :book-info="bookDetail"
        :isFav="userBooks.favorites.some(favBook => favBook.id === bookDetail.id)"
      ></BookInfoCardCom>
    </section>
  </div>
</template>
