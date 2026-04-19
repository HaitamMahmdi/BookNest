<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useUserBooks } from "@/stores/userBooks";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import {
  faBookmark as solidBookmark,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
const props = defineProps({
  book: Object,
});
const userBooks = useUserBooks();
const shelfs = computed(() => userBooks.shelfs);

const container = ref(null);
const emit = defineEmits(["closeShelfsCom", "openAddNewShelfCom"]);

const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    emit("closeShelfsCom");
  }
};
const preventScroll = (e) => {
  e.preventDefault();
};

onMounted(() => {
  document.addEventListener("wheel", preventScroll, { passive: false });
  document.addEventListener("touchmove", preventScroll, { passive: false });
  document.addEventListener("keydown", (e) => {
    if (
      ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(
        e.key,
      )
    ) {
      e.preventDefault();
    }
  });

  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
});
onUnmounted(() => {
  document.removeEventListener("wheel", preventScroll);
  document.removeEventListener("touchmove", preventScroll);
  document.removeEventListener("keydown", (e) => {
    if (
      ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(
        e.key,
      )
    ) {
      e.preventDefault();
    }
  });

  document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <div
    ref="container"
    class="bg-neutral-900 absolute min-w-60 bottom-full left-0 rounded-lg p-4 z-10"
  >
    <ul>
      <li
        @click="emit('openAddNewShelfCom')"
        class="flex justify-between items-start hover:bg-neutral-700 py-2 px-1 rounded-lg"
      >
        <p>add new shelf</p>
        <FontAwesomeIcon class="text-lg p-1" :icon="faPlus" />
      </li>

      <li
        @click="
          userBooks.isInShelfGetter(shelf.id, props.book.id)
            ? userBooks.removeBookFromShelf(shelf.id, props.book.id)
            : userBooks.addBookToShelf(shelf.id, props.book)
        "
        class="flex justify-between items-start hover:bg-neutral-700 py-2 px-1 rounded-lg"
        v-for="shelf in shelfs"
        :key="shelf"
      >
        <p>{{ shelf.name }}</p>
        <FontAwesomeIcon
          v-if="userBooks.isInShelfGetter(shelf.id, props.book.id)"
          class="text-lg p-1"
          :icon="solidBookmark"
        />
        <FontAwesomeIcon v-else class="text-lg p-1" :icon="faBookmark" />
      </li>
    </ul>
  </div>
</template>
