<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useUserBooks } from "@/stores/userBooks";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { useScrollLock } from "@/composables/useScrollControl";
import { useClickOutside } from "@/composables/useClickOutside";
import {
  faBookmark as solidBookmark,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
const props = defineProps({
  book: Object,
  class: String,
});
const userBooks = useUserBooks();
const shelves = userBooks.shelves

const container = ref(null);
const emit = defineEmits(["close-shelves-com", "open-add-new-shelves-com"]);
const { lock, unlock } = useScrollLock();
useClickOutside(container, () => {
  emit("close-shelves-com");
});

const preventScroll = (e) => {
  e.preventDefault();
};

onMounted(() => {
  lock();
});
onBeforeUnmount(() => {
  unlock();
});
</script>
<template>
  <div :class="props.class" ref="container"
    class="bg-neutral-900 parent w-full min-h-60 h-full overflow-y-scroll absolute min-w-60 bottom-full left-0 rounded-t-lg pb-4  z-10">
    <ul>
      <li @click="emit('openAddNewShelfCom')"
        class="flex sticky top-0 border-b-4 border-neutral-900 bg-neutral-700 text-sm cursor-pointer w-full justify-between items-center hover:bg-neutral-500  py-2 px-4  ">
        <p>add new shelf</p>
        <FontAwesomeIcon class="text-sm p-1" :icon="faPlus" />
      </li>
      <li @click="
        userBooks.isInShelfGetter(shelf.id, props.book.id)
          ? userBooks.removeBookFromShelf(shelf.id, props.book.id)
          : userBooks.addBookToShelf(shelf.id, props.book)
        "
        class="flex justify-between cursor-pointer text-sm items-center hover:bg-neutral-700 py-2 px-4 mx-2  rounded-lg"
        v-for="shelf in shelves" :key="shelf">
        <p>{{ shelf.name }}</p>
        <FontAwesomeIcon v-if="userBooks.isInShelfGetter(shelf.id, props.book.id)" class="text-sm text-star p-1"
          :icon="solidBookmark" />
        <FontAwesomeIcon v-else class="text-sm cursor-pointer p-1" :icon="faBookmark" />
      </li>
    </ul>
  </div>
</template>
<style scoped>
.parent::-webkit-scrollbar {
  width: 1px;
  background-color: rgba(0, 0, 0, 0.562);
}

.parent::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.562);
  border-radius: 10px;
}
</style>