<script setup>
import { useUserBooks } from "@/stores/userBooks";
import { onMounted, onUnmounted, ref } from "vue";

const emit = defineEmits(["close"]);

const userBooks = useUserBooks();
const newShelfName = ref("");
const addShelf = async () => {
  if (newShelfName.value.trim()) {
    await userBooks.addNewShelf(newShelfName.value.trim());
    newShelfName.value = "";
    emit("close");
  }
};
const container = ref(null);

const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    emit("close");
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
  <div
    ref="container"
    @click="addShelf"
    class="bg-neutral-800 shadow-max p-6 rounded-lg max-w-md mx-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
  >
    <div @click.stop>
      <h3 class="text-white text-lg font-semibold mb-4">Add New Shelf</h3>
      <div class="flex gap-2">
        <input
          v-model="newShelfName"
          type="text"
          placeholder="Enter shelf name"
          class="flex-1 px-3 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="addShelf"
        />
        <button
          @click="addShelf"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>
