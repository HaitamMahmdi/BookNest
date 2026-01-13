<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useUserBooks } from "@/stores/userBooks";
import { computed, onMounted, onUnmounted, ref } from "vue";
const emit = defineEmits(["closeShelfsCom", "showAddShelfCom"]);
const props = defineProps({
  bookObj: Object,
});
const userBooks = useUserBooks();
const shelfs = computed(() => userBooks.shelfs);
const onShelfToggle = async (bookId, shelfId) => {
  if (userBooks.isInShelf(shelfId, bookId)) {
    await userBooks.removeBookFromShelf(shelfId, bookId);
  } else {
    await userBooks.addBookToShelf(shelfId, props.bookObj);
  }
};
const container = ref(null);
const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    emit("closeShelfsCom");
  }
};
onMounted(() => {
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <div>
    <div
      ref="container"
      style="scrollbar-width: none"
      class="fixed overscroll-contain w-full h-72 shadow-md b rounded-t-4xl overflow-scroll bottom-0 px-4 py-6 z-30 bg-bg-white left-0"
    >
      <ul>
        <li>
          <button
            @click="$emit('showAddShelfCom')"
            class="bg-bg-white cursor-pointer group flex items-center border-b border-bg-secondary mb-1 gap-x-4 w-full px-8 py-2.5"
          >
            <FontAwesomeIcon :icon="faPenToSquare" />
            <p class="font-semibold cursor-pointer w-full text-left">
              Add New Shelf
            </p>
          </button>
        </li>

        <li
          v-for="shelf in shelfs"
          :key="shelf.id"
          @click="onShelfToggle(props.bookObj.id, shelf.id)"
          :id="shelf.id"
          class="bg-bg-white cursor-pointer group flex gap-x-4 w-full px-8 py-2.5"
        >
          <input
            :checked="userBooks.isInShelf(shelf.id, props.bookObj.id)"
            type="checkbox"
            class="cursor-pointer"
            readonly
          />
          <label class="font-semibold cursor-pointer w-full text-left">{{
            shelf.name
          }}</label>
        </li>
      </ul>
    </div>
  </div>
</template>
