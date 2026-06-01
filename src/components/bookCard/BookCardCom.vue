<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faStar,
  faBook,
  faHeart as solidHeart,
  faXmark,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { useUserBooks } from "../../stores/userBooks";
import { computed, ref } from "vue";
import AddNewShelfCom from "./AddNewShelfCom.vue";
import OptionsCom from "../OptionsCom.vue";
import ShowShelves from "./ShowShelves.vue";
const userBooks = useUserBooks();
const props = defineProps({
  book: Object,
  class: String,
});
const emit = defineEmits(["showInfos"]);
const isFavorite = computed(() => userBooks.isFavorite(props.book.id))
const isInShelf = computed(() => userBooks.isInShelfGetter("", props.book.id))
const isReading = computed(() => userBooks.isReading(props.book.id))
const isFinished = computed(() => userBooks.isFinishedBook(props.book.id))
const readingProgress = computed(() => {
  const currentBook = props.book.id

  if (userBooks.reading.length && currentBook) {
    for (const item of userBooks.reading) {
      if (item.book.id === currentBook && item.Thoughts) {
        return item.Thoughts[item.Thoughts.length - 1]
      }
    }
  }
  return []
})
const showModal = ref(false);
function handleShowShelves() {
  showModal.value = !showModal.value;
}
const showAddNewShelfCom = ref(false);

const categories = () => {
  if (!props.book || !props.book.volumeInfo.categories) return [];

  const newCategories = props.book.volumeInfo.categories.flatMap((category) =>
    category.split("/"),
  );
  return [...new Set(newCategories.map((cat) => cat.trim()))];
}
</script>
<template>
  <article v-if="props.book" :class="[props.class]" class="w-60 flex flex-col justify-between relative text-white ">
    <div class="header overflow-hidden ">
      <div>
        <div class="relative bg-bg-secondary/40 rounded-t-lg overflow-hidden  py-2">
          <div v-if="readingProgress.progress || isFinished" title="reading progress"
            :class="[isFinished ? 'text-white bg-success' : 'text-success bg-bg-white']"
            class=" absolute w-fit rounded-br-lg  font-bold  left-0 top-0   flex flex-col justify-center items-center  p-4 text-lg ">
            <p v-if="readingProgress.progress && !isFinished">RP: {{ Number.parseInt(readingProgress.progress * 100 /
              props.book.volumeInfo.pageCount) }}%
            </p>
            <p v-if="isFinished && !readingProgress.progress">RP: 100%</p>
          </div>
          <img class="w-40 h-60 object-cover rounded-md mx-auto" :src="props.book?.volumeInfo?.imageLinks?.thumbnail ||
            '/assets/backGrounds/authBackGround.svg'
            " :alt="props.book?.volumeInfo.title" />
          <span class="w-full -bottom-4 z-10 shadow-[0px_-20px_20px_5px_#00000063] left-0 h-px  absolute "></span>
          <OptionsCom :show-delete="false" :show-edit="false"
            :show-hide="!isInShelf && !isFavorite && !isReading && !isFinished"
            @finish="userBooks.addToFinishedBooks(props.book)" :show-finish="!isFinished"
            :container-class="`absolute! top-2  flex items-center justify-center rounded-full right-2`"
            button-class="hover:bg-Shark bg-Shark/70 w-10! focus:bg-Shark aspect-square rounded-full"
            :options-list-style="`right-0`" :book="props.book" @report="$emit('showInfos')">
            <template #customOptions>
              <button v-if="isReading"
                class="flex w- items-center gap-x-1 cursor-pointer text-error py-2 px-3  transition-all hover:pl-4 hover:bg-error/20">
                <FontAwesomeIcon :icon="faBookOpen" />
                <p>Stop reading</p>
              </button>
              <button v-if="isFinished"
                class="flex w-50  items-center gap-x-1 cursor-pointer text-error py-2 px-3  transition-all hover:pl-4 hover:bg-error/20">
                <FontAwesomeIcon :icon="faXmark" />
                <p>Mark Unfinished</p>
              </button>
            </template>
          </OptionsCom>
        </div>

      </div>
    </div>
    <div
      class="main bg-bg-secondary flex flex-wrap items-center justify-center gap-x-4 px-4 pb-4 rounded-b-lg relative">
      <div class="mb-2 ">
        <p class="text-center text-lg mt-2 font-semibold" :title="props.book?.volumeInfo.title">
          {{
            props.book?.volumeInfo.title.length > 20
              ? props.book.volumeInfo.title.slice(0, 20) + "..."
              : props.book?.volumeInfo.title
          }}
        </p>
        <div class="flex items-center justify-center mt-2">
          <FontAwesomeIcon class="text-star" v-for="star in Number.isInteger(props.book.volumeInfo.averageRating)
            ? props.book.volumeInfo.averageRating
            : 3 || 2" :key="star" :icon="faStar" />
        </div>
      </div>
      <div class=" flex flex-wrap text-sm py-2  w-full font-bold gap-y-4 gap-x-1">
        <RouterLink :title="isReading ? 'continue reading' : 'startReading'"
          :class="[isReading ? 'bg-white text-success' : 'bg-success text-white hover:bg-green-600 ']"
          class="bg-success basis-[49%] text-center cursor-pointer transition p-2 rounded-lg "
          :to="{ name: 'Book', params: { id: props.book.id } }">
          <FontAwesomeIcon :icon="faBook" />
        </RouterLink>
        <button :title="isInShelf ? 'Show shelves' : 'Add to shelf'" @click="handleShowShelves"
          :class="[isInShelf ? 'bg-white text-warning ' : 'bg-warning  text-white  hover:bg-amber-700 ']"
          class="cursor-pointer w-[49%]  transition  p-2  rounded-lg ">
          <FontAwesomeIcon :icon="isInShelf ? solidBookmark : faBookmark" />
        </button>
        <showShelves @close-shelves-com="showModal = false" @open-add-new-shelf-com="showAddNewShelfCom = true"
          :book="props.book" v-if="showModal"></showShelves>
        <button
          @click="isFavorite ? userBooks.removeFromFavorites(props.book.id) : userBooks.addToFavorites(props.book)"
          :class="[isFavorite ? 'bg-white text-error' : 'bg-error text-white  hover:bg-red-600 ']"
          class="bg-error w-full cursor-pointer transition p-2 rounded-lg">
          <FontAwesomeIcon v-if="!isFavorite" :icon="faHeart" />
          <FontAwesomeIcon class="" v-else :icon="solidHeart" />
        </button>


      </div>
    </div>
  </article>
  <AddNewShelfCom @close="showAddNewShelfCom = false" v-if="showAddNewShelfCom"></AddNewShelfCom>
</template>
