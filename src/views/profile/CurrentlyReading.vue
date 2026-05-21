<script setup>
import { useUserBooks } from '@/stores/userBooks';
import BookCardCom from '@/components/bookCard/BookCardCom.vue';
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBook, faBookmark, faEllipsis, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
const userBooks = useUserBooks()
const lastBook = computed(() => userBooks.reading[userBooks.reading.length - 1])
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
    <div class=" w-full bg-Shark text-white py-8">
        <div class="container mx-auto flex gap-4 ">
            <div class="w-80 h-fit  sticky top-28 shrink-0 rounded-lg overflow-hidden pb-4">
                <ul>
                    <li class="w-full p-4 bg-bg-tertiary/40 rounded-t-lg">
                        <img class="w-40 h-60 object-cover rounded-lg mx-auto "
                            src="/assets/backGrounds/authBackGround.svg" alt="">
                    </li>

                    <li class="p-4 rounded-b-lg bg-bg-tertiary">
                        <ul>
                            <li
                                class="flex border-b pb-2 flex-wrap justify-between items-baseline  text-lg font-semibold mb-4">
                                <p>Title :</p>
                                <p>Book title</p>
                            </li>
                            <li class="flex border-b pb-2 justify-between items-baseline  text-lg font-semibold mb-4">
                                <p>Rating :</p>
                                <div class="flex justify-between items-baseline">
                                    <p>3.5/5 </p>
                                    <FontAwesomeIcon :icon="faStar" class="mr-2 text-sm text-star" />
                                </div>
                            </li>
                            <li class="flex border-b pb-2 items-center text-lg font-semibold ">
                                <p>Author:</p>
                                <div class=" flex relative min-h-10 w-full justify-between">
                                    <img title="JohnDoe"
                                        class="w-10 aspect-square absolute hover:z-1 right-0 rounded-full"
                                        src="https://api.dicebear.com/7.x/lorelei/svg?seed=JohnDoe" alt="">
                                    <img title="Woman"
                                        class="w-10 aspect-square absolute hover:z-1 right-5 rounded-full"
                                        src="https://api.dicebear.com/7.x/bottts/svg?seed=woman" alt="">
                                    <img title="BookLover" class="w-10 aspect-square absolute  right-9 rounded-full"
                                        src="https://api.dicebear.com/7.x/bottts/svg?seed=BookLover" alt="">
                                </div>
                            </li>
                            <li class="border-b pb-2">
                                <p class="text-lg font-semibold ">
                                    Discretion :

                                </p>
                                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Culpa voluptas neque quidem
                                    dolor
                                    ullam dolore iure non eius, quis tenetur reprehenderit at ipsa in voluptatum
                                    tempora? Non
                                    voluptas ipsa itaque.</p>
                            </li>
                            <li class=" font-semibold  flex items-center border-b py-2  flex-wrap gap-x-2">
                                <p>Genres:</p>
                                <p class="bg-amber-300 text-sm px-2 py-0.5 font-semibold w-fit rounded-full">Horrow
                                </p>
                                <p class="bg-amber-800 text-sm px-2 py-0.5 font-semibold w-fit rounded-full">Dath
                                </p>
                                <p class="bg-blue-500 text-sm px-2 py-0.5 font-semibold w-fit rounded-full">Love</p>
                                <p class="bg-fuchsia-700 text-sm px-2 py-0.5 font-semibold w-fit rounded-full">Anime
                                </p>
                                .....
                            </li>

                            <li class=" flex flex-wrap  py-2  font-semibold gap-4">
                                <button
                                    class="bg-success cursor-pointer transition text-white py-2 px-4 rounded-lg hover:bg-green-600">
                                    <FontAwesomeIcon :icon="faBook" />
                                    Continue reading
                                </button>
                                <button
                                    class="bg-warning cursor-pointer transition text-white py-2 px-2 rounded-lg hover:bg-amber-700">
                                    <FontAwesomeIcon :icon="faBookmark" />
                                    shelves
                                </button>
                                <button
                                    class="bg-error cursor-pointer transition text-white py-2 px-4 rounded-lg hover:bg-red-600">
                                    <FontAwesomeIcon :icon="faHeart" />
                                    Add to Favorites
                                </button>

                                <button
                                    class="bg-gray-500 cursor-pointer transition text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                                    <FontAwesomeIcon :icon="faEllipsis" />
                                    More
                                </button>
                            </li>

                        </ul>
                    </li>
                </ul>
            </div>

            <div class=" flex  justify-center items-center gap-4 flex-wrap">
                <div class="w-full mb-10">
                    <h2
                        class="  bg-bg-main w-fit ml-4 text-2xl   mb-4 hover:bg-bg-secondary rounded-2xl transition sm:min-w-2xs font-semibold px-4 py-5 ">
                        Books that you are reading :</h2>
                </div>
                <BookCardCom v-for="x in 10" :key="x" :book="book"></BookCardCom>

            </div>

        </div>
    </div>
</template>
