<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

</script>
<template>
    <div class=" fixed top-1/5 left-3/6 -translate-x-3/6 shadow-max z-20 w-4/5 bg-Shark rounded-lg overflow-hidden">
        <form action="">
            <input @change="handleFile" ref="fileInput" type="file" class=" hidden bg-bg-main  " placeholder="" name=""
                id="">
            <button @click="() => fileInput.click()" type="button"
                class="bg-primary text-white w-full cursor-pointer font-semibold  h-60 py-2 px-4 rounded-lg hover:bg-blue-800 bg-blue-700 transition">
                <div v-if="!previewUrl" class=" flex justify-center items-center gap-2">
                    <FontAwesomeIcon :icon="faImage" />
                    <p>Choose an Image</p>
                </div>
            </button>
        </form>
        <ul class=" flex flex-wrap py-4 items-center justify-center gap-4">
            <li v-for="x in 4" :key="x" class=" rounded-lg w-40 h-40 bg-bg-secondary "></li>
        </ul>
        <div class="mb-4 w-fit mx-auto flex gap-x-4 ">
            <button class=" font-semibold cursor-pointer py-2 px-8 rounded-lg hover:bg-blue-700 bg-blue-800 transition">
                <p>Submit</p>
            </button>
            <button class=" font-semibold cursor-pointer  py-2 px-4 rounded-lg hover:bg-error bg-error/40 transition">
                <p>Cansle</p>
            </button>
        </div>
    </div>
</template>