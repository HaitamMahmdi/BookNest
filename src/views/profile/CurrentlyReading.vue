<script setup>
import { useUserBooks } from '@/stores/userBooks';
import BookCardCom from '@/components/bookCard/BookCardCom.vue';
import { computed, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
const userBooks = useUserBooks()

</script>
<template>
    <div class=" w-full bg-Shark text-white min-h-screen py-8">
        <div v-if="userBooks.reading.length" class=" container mx-auto gap-x-4 ">

            <div class="">
                <h2
                    class="  bg-bg-main w-fit max-sm:mx-auto  text-2xl hover:bg-bg-secondary rounded-2xl transition font-semibold px-4 py-5 ">
                    Books that you are reading :</h2>
            </div>
            <div class="mt-8 flex w-full items-center justify-center flex-wrap gap-x-4">
                <div class="h-fit" @click="book = item.book" :id="item.book.id" v-for="item in userBooks.reading"
                    :key="item">
                    <BookCardCom :book="item.book">
                    </BookCardCom>
                </div>

            </div>


        </div>
        <div class=" w-full container mx-auto flex items-top justify-center bg-Shark text-white min-h-screen py-8"
            v-else>
            <RouterLink class="text-2xl text-center hover:text-success font-bold  transition-colors" to="/">
                <FontAwesomeIcon class="text-4xl p-1" :icon="faBook" />

                <p>Start reading Now</p>

            </RouterLink>

        </div>
    </div>
</template>
