<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPen, faBook, faClock, faMessage, faLocation, faCakeCandles, faShare, faHeart, faBookmark as solidBookmark, faStar, faUser, faEllipsis, faEllipsisVertical, faCamera, faImage, faUpload, faTrash, faDeaf } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faBookmark } from '@fortawesome/free-regular-svg-icons';
import CarouselCom from '@/components/carousel/CarouselCom.vue'
import SlideCom from '@/components/carousel/SlideCom.vue';
import BookCardCom from '@/components/bookCard/BookCardCom.vue';
import ShowShelves from '@/components/bookCard/ShowShelves.vue';
import AddNewShelfCom from "@/components/bookCard/AddNewShelfCom.vue";
import OptionsCom from '@/components/OptionsCom.vue';
import AddQuoteModal from '@/components/modals/AddQuoteModal.vue';
import Modal from '@/components/modals/Modal.vue';
import { useUserBooks } from '@/stores/userBooks';
import { useUserStore } from '@/stores/userStore';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserAuth } from '../../stores/userAuth';

const userStore = useUserStore()
const userBooks = useUserBooks();
const user = useUserAuth()
const readingList = computed(() => userBooks.reading)
const reading = computed(() => readingList.value.length ? readingList.value[readingList.value.length - 1].book : null)
const showModal = ref(false)
const showAddNewShelfCom = ref(false);
const show = ref(false);
</script>
<template>
    <section class=" text-white  bg-Shark pt-4">
        <div class="container grid  grid-cols-1  lg:grid-cols-[352px_minmax(0,1fr)] gap-0 mx-auto">
            <section class="book-reading-info max-lg:w-full  p-4 w-fit">
                <div
                    class="  bg-bg-main mb-4 hover:bg-bg-secondary rounded-2xl transition sm:min-w-2xs font-semibold px-4 py-5 ">
                    <p>Join date: 1 Mars 2026</p>
                </div>
                <ul class="bg-bg-main rounded-lg cursor-default p-4">
                    <li
                        class=" flex  hover:bg-bg-secondary rounded-2xl transition sm:min-w-2xs justify-between items-center text-warning font-semibold px-4 py-5 ">
                        <p>Hours spent reading: </p>
                        <div class="flex items-center gap-x-1">
                            <p>100h</p>
                            <FontAwesomeIcon :icon="faClock" />
                        </div>
                    </li>

                    <li
                        class="sm:min-w-2xs hover:bg-bg-secondary rounded-2xl transition flex justify-between items-center font-semibold px-4 py-5 ">

                        <p>Currently reading :</p>
                        <div class="flex items-center justify-between gap-x-1">
                            <p>{{ readingList.length }}</p>
                            <FontAwesomeIcon :icon="faBook" />
                        </div>
                    </li>
                    <li
                        class="sm:min-w-2xs hover:bg-bg-secondary rounded-2xl transition flex justify-between items-center text-success font-semibold px-4 py-5 ">

                        <p>Finished books: </p>
                        <div>
                            <span>{{ userBooks.finishedBooks.length }}</span>
                            <FontAwesomeIcon :icon="faBook" />
                        </div>
                    </li>

                </ul>
                <div class="bg-bg-main  rounded-lg cursor-default mt-4 p-4">

                    <p class=" text-2xl font-bold mb-2 ">
                        Personal details:</p>
                    <ul>
                        <li
                            class=" flex items-center font-semibold gap-x-1.5 min-w-2xs hover:bg-bg-secondary rounded-2xl transition px-4 py-5 ">
                            <FontAwesomeIcon :icon="faCakeCandles" class=" " />
                            <p>september 17, 2002</p>
                        </li>
                    </ul>
                </div>
                <div class="bg-bg-main relative rounded-lg cursor-default mt-4 p-4">

                    <p class=" text-2xl font-bold mb-4 ">
                        favourite quotes :</p>
                    <button v-if="userStore.quotes.length" v-for="quote in userStore.quotes" :key="quote"
                        class="font-semibold group flex w-full   items-center justify-center p-2 mb-4 overflow-hidden italic underline bg-Shark rounded-2xl leading-relaxed">
                        <p class="w-57 wrap-break-word p-2">{{ quote.text }}</p>
                        <button
                            class="flex flex-col gap-2  relative -right-30 transition-all  group-focus:right-0 group-hover:right-0 items-center justify-center">
                            <FontAwesomeIcon :icon="faShare"
                                class=" bg-warning/60 p-2 rounded-lg transition-colors hover:bg-warning cursor-pointer text-sm" />
                            <FontAwesomeIcon :icon="faTrash" @click="userStore.deleteQuote(quote.id)"
                                class=" text-sm rounded-lg p-2 bg-error/60 transition-colors hover:bg-error cursor-pointer" />

                        </button>
                    </button>

                    <div>
                        <button @click="show = true"
                            class="bg-primary w-full bg-blue-600/40 cursor-pointer  text-white py-2 px-4 mt-4 rounded-lg hover:bg-blue-600 transition">
                            Add Quote
                        </button>
                        <button v-if="userStore.quotes.length > 3"
                            class="bg-primary w-full bg-bg-tertiary/40 cursor-pointer  text-white py-2 px-4 mt-4 rounded-lg hover:bg-bg-tertiary transition">
                            see all quotes
                        </button>

                    </div>
                    <Modal v-if="show" :show="show" @close="show = false">
                        <AddQuoteModal></AddQuoteModal>
                    </Modal>
                </div>
                <div class="bg-bg-main rounded-lg cursor-default mt-4 p-4">
                    <p class=" text-2xl font-bold mb-2 ">
                        about :</p>
                    <p class="font-semibold py-4 px-5 bg-Shark rounded-2xl leading-relaxed">Lorem ipsum dolor sit
                        amet consectetur
                        adipisicing
                        elit.
                        Eaque omnis,
                        ex quas nemo
                        voluptate consequatur, doloremque deleniti cumque, magnam sed corporis. Voluptas</p>
                </div>
                <div class="bg-bg-main mt-4 p-4 w-full h-fit rounded-lg">

                    <p class=" text-2xl font-bold mb-2 ">
                        Friends:</p>
                    <ul>
                        <li v-for="x in 3" :key="x"
                            class=" flex  hover:bg-bg-secondary rounded-2xl transition min-w-2xs justify-between items-center   p-4 ">

                            <div class=" flex flex-wrap  gap-x-2">
                                <img :src="`https://randomuser.me/api/portraits/men/${x + 2}.jpg`"
                                    class=" w-15 h-15 rounded-lg border-2 border-white">
                                <div class="">
                                    <p class="font-semibold">Jane Smith{{ x }}</p>
                                    <div class=" text-sm text-[#6b7280] flex items-center gap-x-1">
                                        <FontAwesomeIcon :icon="faLocation" class=" " />
                                        <p>someplace,strete 10 to 20</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>

                </div>
            </section>
            <section class="main h-fit w-full  p-2 sm:p-4">
                <div>
                    <h3
                        class="  bg-bg-main max-sm:mx-auto mb-4 hover:bg-bg-secondary rounded-2xl transition w-fit font-semibold text-2xl p-4  ">
                        Books you are reading :</h3>
                    <article v-if="reading" class=" flex  rounded-lg max-sm:flex-wrap  overflow-hidden bg-bg-main ">
                        <div class="max-sm:w-full shrink-0 relative overflow-hidden">
                            <OptionsCom :show-delete="false" :show-edit="false" :show-hide="false"
                                @finish="userBooks.addToFinishedBooks(reading)"
                                :show-finish="!userBooks.isFinishedBook(reading.id)"
                                :container-class="`absolute! top-2  flex items-center justify-center rounded-full right-2`"
                                button-class="hover:bg-Shark bg-Shark/70 w-10! focus:bg-Shark aspect-square rounded-full"
                                :options-list-style="`right-0`" @report="$emit('showInfos')">
                            </OptionsCom>
                            <span
                                class="max-sm:w-full -bottom-4 z-10 shadow-[0px_-20px_20px_5px_#00000063] left-0 h-px  absolute "></span>
                            <img class="min-w-40 max-sm:mx-auto h-full "
                                :src="reading.volumeInfo?.imageLinks?.thumbnail" :alt="reading?.volumeInfo.title">
                        </div>
                        <ul class="p-4 w-full ">
                            <li class="mb-4 flex justify-between items-center">
                                <h3 class=" font-semibold">{{ reading?.volumeInfo.title }}</h3>
                                <RouterLink :to="{ name: 'Book', params: { id: reading.id } }" target="_blank"
                                    :class="[reading.volumeInfo.averageRating ? '' : ' font-semibold  transition-colors cursor-pointer hover:text-success']"
                                    class=" flex items-center gap-x-1 text-sm">
                                    <p>{{ reading.volumeInfo.averageRating ? reading.volumeInfo.averageRating + `/5`
                                        : 'Be the first to review' }} </p>
                                    <FontAwesomeIcon v-if="reading.volumeInfo.averageRating" :icon="faStar"
                                        class="mr-2 text-star" />
                                </RouterLink>
                            </li>
                            <li class=" font-semibold mb-4">
                                <div class="flex max-sm:w-fit " v-for="(author, index) in reading?.volumeInfo.authors"
                                    :key="author">
                                    <img class="w-7 h-7 rounded-full mr-1"
                                        :src="`/assets/authors/author${index ? index : ''}.webp`" :alt="author" />
                                    <p class="text-[14px]">{{ author }}</p>
                                </div>
                            </li>
                            <li class="flex flex-wrap mb-4">
                                <p class="">publisher :</p>
                                <p class="ml-2 font-normal text-[1rem]">
                                    {{ reading.volumeInfo.publisher || "Unknown" }}
                                </p>
                            </li>

                            <li class=" font-semibold flex items-center mb-4  flex-wrap gap-x-2">
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
                            <li class="  mb-4 flex items-start gap-x-2 flex-wrap">
                                <p class="font-bold text-textLg">description :</p>
                                <p v-html="reading.volumeInfo?.description?.slice(0, 100) + `...`"
                                    class="ml-2 max-sm:ml-0">
                                </p>
                            </li>
                            <li class=" flex relative flex-wrap  font-semibold gap-4">
                                <RouterLink target="_blank" title="continue reading"
                                    class="bg-white text-success w-fit text-center cursor-pointer transition p-2 rounded-lg "
                                    :to="{ name: 'Book', params: { id: reading.id } }">
                                    <FontAwesomeIcon :icon="faBook" />
                                </RouterLink>
                                <button
                                    :title="userBooks.isInShelfGetter('', reading.id) ? 'Show shelves' : 'Add to shelf'"
                                    @click="showModal = true"
                                    :class="[userBooks.isInShelfGetter('', reading.id) ? 'bg-white text-warning ' : 'bg-warning  text-white  hover:bg-amber-700 ']"
                                    class="cursor-pointer w-fit  transition  p-2  rounded-lg ">
                                    <FontAwesomeIcon
                                        :icon="userBooks.isInShelfGetter('', reading.id) ? solidBookmark : faBookmark" />
                                </button>
                                <showShelves @close-shelves-com="showModal = false"
                                    @open-add-new-shelf-com="showAddNewShelfCom = true" :book="reading"
                                    v-if="showModal">
                                </showShelves>
                                <button
                                    @click="userBooks.isFavorite(reading.id) ? userBooks.removeFromFavorites(reading.id) : userBooks.addToFavorites(reading)"
                                    :class="[userBooks.isFavorite(reading.id) ? 'bg-white text-error' : 'bg-error text-white  hover:bg-red-600 ']"
                                    class="bg-error w-fit cursor-pointer transition p-2 rounded-lg">

                                    <FontAwesomeIcon v-if="!userBooks.isFavorite(reading.id)" :icon="faHeartRegular" />
                                    <FontAwesomeIcon class="" v-else :icon="faHeart" />
                                </button>
                            </li>
                        </ul>
                    </article>
                    <RouterLink v-if="userBooks.reading.length > 1"
                        :to="{ name: 'CurrentlyReading', params: { id: user.user.uid } }"
                        class="w-full block p-4 text-center font-semibold bg-bg-main mt-4 rounded-2xl cursor-pointer hover:bg-gray-700 transition">
                        <p>
                            See all <span class="text-[#ddd]">({{ userBooks.reading.length }})</span>
                        </p>
                    </RouterLink>
                    <div class=" w-full container mx-auto flex items-top justify-center bg-Shark text-white py-8"
                        v-else>
                        <RouterLink class="text-2xl text-center hover:text-success font-bold  transition-colors" to="/">
                            <FontAwesomeIcon class="text-4xl p-1" :icon="faBook" />

                            <p>Start reading Now</p>

                        </RouterLink>

                    </div>
                </div>
                <div class="mt-4">
                    <h3
                        class="  bg-bg-main  max-sm:mx-auto mb-4 hover:bg-bg-secondary  rounded-2xl transition w-fit font-semibold text-2xl p-4  ">
                        Favorite authors :</h3>


                    <CarouselCom :items-per-view="4" :show-arrows="true">
                        <SlideCom v-for="x in 8" :key="x">
                            <article
                                class="  group relative shrink-0  text-center bg-bg-main pb-4  rounded-2xl overflow-hidden  ">
                                <span
                                    class=" block z-10 rounded-2xl  absolute top-0 left-0 w-full h-full  inset-0 pointer-events-none  group-hover:shadow-[0_0px_0px_8px_#a27b5c_inset] shadow-[0_0px_0px_2px_#a27b5c_inset] transition-all"></span>
                                <div>
                                    <img class="w-full" :src="`https://randomuser.me/api/portraits/men/${x + 1}.jpg`"
                                        alt="author" />
                                    <h3 class="font-semibold text-lg">Author Name {{ x }}</h3>
                                    <p class="max-w-3/4 mx-auto "><i><b>"Never give up until your balls explode"</b></i>
                                    </p>
                                </div>
                                <div class=" flex flex-wrap gap-4 justify-center items-center pt-4">
                                    <button title="Number of books publishd"
                                        class="bg-success font-semibold cursor-pointer transition text-white py-2 px-4 rounded-lg hover:bg-green-600">
                                        <FontAwesomeIcon :icon="faBook" />
                                        10
                                    </button>
                                    <button title="Number of readers"
                                        class="bg-star font-semibold cursor-pointer transition text-white py-2 px-4 rounded-lg hover:bg-warning">
                                        <FontAwesomeIcon :icon="faUser" />
                                        20K
                                    </button>
                                </div>
                            </article>
                        </SlideCom>

                    </CarouselCom>

                </div>

                <div class="mt-8 ">
                    <!-- !TODO: Improve carousel display -->
                    <h3
                        class="  bg-bg-main max-sm:mx-auto mb-4 hover:bg-bg-secondary rounded-2xl transition w-fit font-semibold text-2xl p-4  ">
                        Finished books :</h3>
                    <div>

                        <CarouselCom v-if="userBooks.finishedBooks.length > 1" :items-per-view="4" :show-arrows="true">
                            <SlideCom v-for="book in userBooks.finishedBooks" :key="book.id">
                                <BookCardCom :book="book.book"></BookCardCom>
                            </SlideCom>

                        </CarouselCom>
                        <BookCardCom v-if="userBooks.finishedBooks.length < 1" :book="userBooks.finishedBooks[0]?.book">
                        </BookCardCom>
                    </div>
                </div>
            </section>

        </div>
        <AddNewShelfCom @close="showAddNewShelfCom = false" v-if="showAddNewShelfCom"></AddNewShelfCom>

    </section>

</template>