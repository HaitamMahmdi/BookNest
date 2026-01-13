<script setup>
import { useUserBooks } from "../../stores/userBooks";
import { ref } from "vue";
const userBooks = useUserBooks();
const shelfName = ref("");
</script>
<template>
  <div
    @click.self="$emit('close')"
    class="w-full h-full absolute flex justify-center items-center left-0 bg-shdowOverlay top-0 z-60"
  >
    <div
      ref="addShelf"
      class="bg-bg-white w-full md:w-lg top-3/6 left-0 p-4 rounded-md shadow-md"
    >
      <p class="mb-4">New shelf</p>
      <input
        v-model="shelfName"
        type="text"
        class="block w-full border border-bg-secondary p-2 rounded-md"
        placeholder="New shelf name..."
      />
      <button
        @click="userBooks.createShelfs(shelfName)"
        class="px-4 py-1 border w-full border-bg-main rounded-md mt-4 bg-bg-secondary text-bg-white"
      >
        save
      </button>
    </div>
  </div>
</template>
