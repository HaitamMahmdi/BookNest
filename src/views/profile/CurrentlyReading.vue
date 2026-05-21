<script setup>
import { useUserBooks } from '../../stores/userBooks';
import BookCardCom from '../../components/bookCard/BookCardCom.vue';
const userBooks = useUserBooks()
const book = {
    id: 'I forgger',
    volumeInfo: {
        pageCount: 500,
        publisher: "just me",
        title: 'the best book ever',
        averageRating: 4,
    }
}
</script>
<template>
    <div class=" w-full bg-Shark text-white">
        <BookCardCom :book="book"></BookCardCom>
    </div>
</template>
