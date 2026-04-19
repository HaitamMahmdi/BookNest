<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faStar,
  faBook,
  faHeart as solidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { useUserBooks } from "../../stores/userBooks";
import { computed, ref } from "vue";
import ShowShelfsCom from "./ShowShelfsCom.vue";
import AddNewShelfCom from "./AddNewShelfCom.vue";
const userBooks = useUserBooks();
const props = defineProps({
  book: Object,
});
const emit = defineEmits(["showInfos"]);
const isFavorite = computed(() => {
  return userBooks.isFavorite(props.book.id);
});
const isInShelf = computed(() => {
  return userBooks.isInShelfGetter("", props.book.id);
});
const showShelfs = ref(false);
function handleShowShelfs() {
  showShelfs.value = !showShelfs.value;
}
const showAddNewShelfCom = ref(false);
</script>
<template>
  <article
    class="w-45 bg-bg-secondary flex flex-col justify-between px-2 py-4 rounded-lg relative text-white max-h-105"
  >
    <div class="header">
      <div>
        <img
          class="w-40 h-60 object-cover rounded-md mx-auto"
          :src="
            props.book?.volumeInfo.imageLinks?.thumbnail ||
            '/assets/backGrounds/authBackGround.svg'
          "
          :alt="props.book?.volumeInfo.title"
        />
        <p
          class="text-center mt-2 font-semibold"
          :title="props.book?.volumeInfo.title"
        >
          {{
            props.book?.volumeInfo.title.length > 40
              ? props.book.volumeInfo.title.slice(0, 40) + "..."
              : props.book?.volumeInfo.title
          }}
        </p>
        <div class="flex items-center justify-center mt-2">
          <FontAwesomeIcon
            class="text-star"
            v-for="star in Number.isInteger(props.book.volumeInfo.averageRating)
              ? props.book.volumeInfo.averageRating
              : 3 || 2"
            :key="star"
            :icon="faStar"
          />
        </div>
      </div>
    </div>
    <div class="main flex items-center justify-center gap-x-4 mt-4 relative">
      <button
        @click="handleShowShelfs"
        title="add to shelf"
        class="cursor-pointer"
      >
        <FontAwesomeIcon
          v-if="isInShelf"
          class="text-2xl p-1 text-star"
          :icon="solidBookmark"
        />
        <FontAwesomeIcon v-else class="text-2xl p-1" :icon="faBookmark" />

        <ShowShelfsCom
          @close-shelfs-com="showShelfs = false"
          @open-add-new-shelf-com="showAddNewShelfCom = true"
          :book="props.book"
          v-if="showShelfs"
        ></ShowShelfsCom>
      </button>
      <button
        v-if="isFavorite"
        @click="userBooks.removeFromFavorites(props.book.id)"
        title="remove from favorites"
        class="cursor-pointer"
      >
        <FontAwesomeIcon class="text-2xl p-1 text-error" :icon="solidHeart" />
      </button>
      <button
        v-else
        @click="userBooks.addToFavorites(props.book)"
        title="add to favorites"
        class="cursor-pointer"
      >
        <FontAwesomeIcon class="text-2xl p-1" :icon="faHeart" />
      </button>
      <router-link
        :to="`/Book/${props.book.id}`"
        title="view details"
        class="cursor-pointer"
      >
        <FontAwesomeIcon class="text-2xl p-1" :icon="faBook" />
      </router-link>
    </div>
  </article>
  <AddNewShelfCom
    @close="showAddNewShelfCom = false"
    v-if="showAddNewShelfCom"
  ></AddNewShelfCom>
</template>
