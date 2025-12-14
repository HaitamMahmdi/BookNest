<script setup>
const props = defineProps({
  bookObj: Object,
});
const bookObj = props.bookObj;
console.log(bookObj);
</script>
<template>
  <div
    @click="$emit('showInfos', bookObj)"
    v-if="bookObj && bookObj.volumeInfo.imageLinks"
    :id="bookObj.id"
    class="card cursor-pointer h-64 relative hover:-top-1 transform duration-300 top-0"
  >
    <div class="w-full h-full">
      <img
        draggable="false"
        class="w-full h-full"
        :src="bookObj.volumeInfo.imageLinks?.thumbnail"
        :alt="`${bookObj.volumeInfo.title}`"
      />
    </div>
  </div>
</template>
