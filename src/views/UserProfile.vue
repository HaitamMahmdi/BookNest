<script setup>
/***
 * !TODO:- make the profile dynamic by fetching data from the backend and using it to populate the profile
 * !TODO:- make the profile editable by the user and allow them to change their profile picture, name, bio, etc.
 * !TODO:- add a section for the user's friends and allow them to add/remove friends, see their friends' profiles, etc.
 * !TODO:- add a section for the user's favorite books and allow them to add/remove books from their favorites, see their favorite books, etc.
 * !TODO:- add a section for the user's reading history and allow them to see the books they've read, the books they're currently reading, etc.
 * !TODO:- allow the user to add/remove quotes, see his favorite quotes, etc.
 * !TODO:- add a slider for the user's favorite authors, add/remove authors from their favorites, etc.
 * 
 */
import { computed, reactive, ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPen, faBook, faClock, faMessage, faLocation, faCakeCandles, faShare, faHeart, faBookmark, faStar, faUser, faEllipsis, faEllipsisVertical, faCamera, faImage, faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import BookCardCom from '../components/BookCard/BookCardCom.vue';
import OptionsCom from '../components/OptionsCom.vue';
import { useScrollLock } from '../composables/useScrollControl';
import { nextTick } from 'vue';
import { useUserBooks } from '../stores/userBooks';
import { useUserAuth } from '../stores/userAuth';
import { useUserStore } from '../stores/userStore';
import CarouselCom from '../components/carousel/CarouselCom.vue';
import SlideCom from '../components/carousel/SlideCom.vue';
import ChangeCoverModal from '../components/modals/ChangeCoverModal.vue';
import MessageModal from '../components/modals/MessageModal.vue';
import ChoseImageModal from '../components/modals/ChoseImageModal.vue';
import LoadingCom from '../components/LoadingCom.vue';
const userStore = useUserStore();
const coverUrl = computed(() => userStore.coverURL)
const profileUrl = computed(() => userStore.profileImgURL)
const coverHistory = computed(() => userStore.coverImageHistory)
const profileHistory = computed(() => userStore.profileImageHistory)

const userBooks = useUserBooks();
const messageKey = ref(0)
const userAuth = useUserAuth();
const bookObj = {
    id: `sdwdf038372`,
    volumeInfo: {
        title: `Just a book`,
        averageRating: 4,
        imageLinks: {
            thumbnail: `https://picsum.photos/160/240`
        }
    }
}

const fileInput = ref(null);
const previewUrl = reactive({
    coverUrl: null,
    profileUrl: null,
})
const { lock, unlock } = useScrollLock();
watch(
    () => [previewUrl.coverUrl, previewUrl.profileUrl],
    ([cover, profile]) => {
        if (cover || profile) {
            lock()
        } else {
            unlock()
        }
    }
)

const messageText = ref('')
const messageType = ref('')
const showChoseModal = ref(0)
const showMessageModal = ref(false);
const isSettingCoverImg = ref(false)
const isSettingProfileImg = ref(false)
const showMessage = (text, type) => {
    messageText.value = text
    messageType.value = type

    showMessageModal.value = false
    messageKey.value++

    nextTick(() => {
        showMessageModal.value = true
    })
}
const imageValidator = (type, file) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"]
    if (!file) {
        previewUrl.coverUrl = null
        return false
    }
    if (!allowedTypes.includes(file.type)) {
        showMessage('Please upload a valid image file (PNG, JPEG, WebP)', 'error')
        return false
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
        if (type === 'cover') {
            if (img.width < 400 || img.height < 150) {
                showMessage('Image dimensions must be at least 400x150 pixels', 'error')
                URL.revokeObjectURL(url)
                return false
            }

        } else {
            if (img.width < 180 || img.height < 180) {
                showMessage('Image dimensions must be at least 180x180 pixels', 'error')
                URL.revokeObjectURL(url)
                return false
            }
        }
    }
    return true
}
const selectedFile = ref(null)
const handleFile = (type, event) => {
    const file = event.target.files[0]
    const isValidImg = imageValidator(type, file)
    if (!isValidImg) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    if (type === 'profile') {
        previewUrl.profileUrl = url
    } else {
        previewUrl.coverUrl = url
    }
    img.src = url
    selectedFile.value = file
}

const setNewCover = async () => {
    if (selectedFile.value) {
        isSettingCoverImg.value = true
        const success = await userStore.updateProfileMedia(selectedFile.value, "cover")
        if (success) {
            showMessage('Cover image updated successfully', 'success')
            previewUrl.coverUrl = null
        } else {
            showMessage('Failed to update cover image. Please try again.', 'error')
        }
        isSettingCoverImg.value = false
    }
}
const setNewProfileImg = async () => {
    if (selectedFile.value) {
        isSettingProfileImg.value = true
        const success = await userStore.updateProfileMedia(selectedFile.value, "profile")
        if (success) {
            showMessage('Profile image updated successfully', 'success')
            previewUrl.profileUrl = null
        } else {
            showMessage('Failed to update profile image. Please try again.', 'error')
        }
        isSettingProfileImg.value = false
    }
}

const imgSelectedForProfile = async (id) => {
    isSettingProfileImg.value = true
    const success = await userStore.changeProfileMedia(id)
    if (success) {
        showMessage('Profile image updated successfully', 'success')
    } else {
        showMessage('Failed to update profile image. Please try again.', 'error')
    }
    isSettingProfileImg.value = false
}
const imgSelectedForCover = async (id) => {
    isSettingCoverImg.value = true
    const success = await userStore.changeCoverMedia(id)
    if (success) {
        showMessage('Cover image updated successfully', 'success')
    } else {
        showMessage('Failed to update cover image. Please try again.', 'error')
    }
    isSettingCoverImg.value = false
}
</script>
<template>
    <div class=" text-white">
        <MessageModal :key="messageKey" :type="messageType" enters-from="top" :message="messageText"
            :show-message="showMessageModal" @close="showMessageModal = false">
        </MessageModal>
        <section class="profileOverView ">
            <div class="relative">
                <div class="w-full  aspect-3/1  flex justify-center bg-Shark max-lg:h-75 max-h-[390px] relative">
                    <div v-if="previewUrl.coverUrl"
                        class=" absolute z-20 w-full flex items-center justify-end gap-x-2 px-8 py-2 font-semibold bg-bg-main/80">
                        <button @click="setNewCover"
                            class=" cursor-pointer bg-blue-700 rounded-lg px-4 py-2">Save</button>
                        <button @click="previewUrl.coverUrl = ''"
                            class=" cursor-pointer bg-error/50 rounded-lg px-4 py-2">cancel</button>
                    </div>
                    <div v-if="previewUrl.profileUrl"
                        class=" absolute w-full flex items-center justify-end gap-x-2 px-8 py-2 font-semibold bg-bg-main/80">
                        <button @click="setNewProfileImg"
                            class=" cursor-pointer bg-blue-700 rounded-lg px-4 py-2">Save</button>
                        <button @click="previewUrl.profileUrl = ''"
                            class=" cursor-pointer bg-error/50 rounded-lg px-4 py-2">cancel</button>
                    </div>

                    <div v-if="isSettingCoverImg" class=" w-full h-full absolute left-0 bg-Shark/80 top-0">
                        <LoadingCom :visible="true" text="Setting a new cover"></LoadingCom>
                    </div>
                    <img :src="previewUrl.coverUrl ? previewUrl.coverUrl : coverUrl?.url ? coverUrl?.url : 'https://placehold.co/1200x390/dcd7c9/9ca3af?text=No+Cover'"
                        class="max-w-full h-full " alt="Profile Picture">
                    <OptionsCom options-list-style="md:-left-full!  right-0 w-fit overflow-hidden"
                        button-class="cover bg-white  flex items-center gap-x-2  text-black! font-semibold px-4 py-2 rounded-lg "
                        :disable-button="!!previewUrl.coverUrl || !!previewUrl.profileUrl || !!showChoseModal"
                        container-class=" absolute! z-20 right-5 max-sm:right-2 bottom-5 " :hide-all="true">
                        <template #buttonContent>
                            <FontAwesomeIcon :icon="faCamera" />
                            <p class=" max-sm:hidden">Edit cover image</p>
                        </template>
                        <template #customOptions="{ closeModal }">
                            <li class="p-2 hover:bg-gray-700 w-2xs cursor-pointer  transition  ">
                                <button @click="
                                    showChoseModal = 1, closeModal()
                                    "
                                    class="flex items-center gap-x-2 w-full font-semibold cursor-pointer pl-2 text-left ">
                                    <FontAwesomeIcon :icon="faImage" />
                                    <p>Choose cover
                                        photo</p>
                                </button>
                            </li>
                            <li class="p-2  border-t hover:bg-gray-700 w-2xs cursor-pointer   transition">
                                <button @click="fileInput.click(), closeModal()"
                                    class="w-full flex items-center gap-x-2 font-semibold cursor-pointer text-left pl-2  ">
                                    <FontAwesomeIcon :icon="faUpload" />
                                    <input @change="handleFile('cover', $event)" ref="fileInput" type="file"
                                        class=" hidden" name="" id="">
                                    <p>Upload cover
                                        photo</p>
                                </button>
                            </li>

                        </template>
                    </OptionsCom>
                </div>
                <div class=" absolute flex justify-center items-center  mx-auto left-0 right-0 -bottom-30 ">
                    <div class="mx-auto">
                        <div class="w-45 h-45 ">
                            <button class="  relative ">
                                <OptionsCom container-class="  " button-class="relative cover1"
                                    :disable-button="!!previewUrl.coverUrl || !!previewUrl.profileUrl || !!showChoseModal"
                                    options-list-style=" w-fit z-50  -top-10! overflow-hidden -left-3/9"
                                    :hide-all="true">

                                    <template #buttonContent>
                                        <img :src="previewUrl.profileUrl ? previewUrl.profileUrl : profileUrl?.url ? profileUrl?.url : `https://www.gravatar.com/avatar/?d=mp`"
                                            alt="userImage`"
                                            class="rounded-full pointer-events-none  border-4 border-white  w-50 aspect-square object-center ">
                                        <div v-if="isSettingProfileImg"
                                            class="absolute left-3/6 w-44 aspect-square bg-Shark/80 top-3/6 -translate-3/6 rounded-full  overflow-hidden">
                                            <LoadingCom :visible="true" text="Setting profile image"></LoadingCom>
                                        </div>

                                    </template>
                                    <template #customOptions="{ closeModal }">
                                        <li class="p-2 hover:bg-gray-700 w-2xs cursor-pointer  transition  ">
                                            <button @click="
                                                showChoseModal = 2, closeModal()
                                                "
                                                class="flex items-center gap-x-2 w-full font-semibold cursor-pointer pl-2 text-left ">
                                                <FontAwesomeIcon :icon="faImage" />
                                                <p>Choose profile
                                                    photo</p>
                                            </button>
                                        </li>

                                    </template>
                                </OptionsCom>
                                <ChoseImageModal v-if="showChoseModal"
                                    @image-selected="showChoseModal === 1 ? imgSelectedForCover($event) : imgSelectedForProfile($event)"
                                    @file-uploaded="handleFile" @close="showChoseModal = 0" :show="showChoseModal"
                                    :isFor="showChoseModal === 1 ? 'cover' : 'profile'">
                                    >
                                </ChoseImageModal>
                            </button>

                        </div>
                        <h2 class="text-2xl text-center font-bold mt-4">John Doe</h2>
                        <p class="text-gray-600 text-center">Book Enthusiast</p>
                    </div>
                </div>

            </div>
        </section>
        <section class="profileInfo mt-40 container mx-auto border-t border-bg-secondary ">
            <ul class=" flex flex-wrap max-lg:justify-center">
                <li class="py-4 px-5 hover:bg-gray-700 transition cursor-pointer rounded-lg">
                    <p>All</p>
                </li>
                <li class="p-4 hover:bg-gray-700 transition cursor-pointer rounded-lg max-sm:hidden">
                    <p>Books read</p>
                </li>
                <li class="p-4 hover:bg-gray-700 transition cursor-pointer rounded-lg  max-sm:hidden">
                    <p>Friends</p>
                </li>
                <li class="p-4 hover:bg-gray-700 transition cursor-pointer rounded-lg max-md:hidden">
                    <p>Favorite books & quotes</p>
                </li>
                <li class="p-4  hover:bg-gray-700 transition cursor-pointer rounded-lg max-md:hidden">
                    <p>About</p>
                </li>
                <li class=" md:hidden translate-x-3/8  ">
                    <button class="  ">
                        <OptionsCom
                            :button-class="`hover:bg-gray-700 transition cursor-pointer rounded-lg hover:bg-gray-700 p-4 flex items-center gap-x-2 text-white  focus:bg-gray-700`"
                            :options-list-style="`right-3/6! translate-x-[27.6%] bg-bg-main  shadow-max rounded-lg  p-2 min-w-[300px]`"
                            :hide-all="true">
                            <template #buttonContent>
                                <FontAwesomeIcon :icon="faEllipsis" />
                                <p>More</p>
                            </template>
                            <template #customOptions>
                <li class="p-4 hover:bg-gray-700 sm:hidden transition cursor-pointer rounded-lg">
                    <p>Books read</p>
                </li>
                <li class="p-4 hover:bg-gray-700 sm:hidden transition cursor-pointer rounded-lg">
                    <p>Friends</p>
                </li>
                <li class="p-4 hover:bg-gray-700 transition cursor-pointer rounded-lg">
                    <p>Favorite books & quotes</p>
                </li>
                <li class="p-4 hover:bg-gray-700 transition cursor-pointer rounded-lg">
                    <p>About</p>
                </li>
</template>
</OptionsCom>

</button>

</li>

</ul>
</section>

<section class="  bg-Shark pt-4">
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
                        <p>1000h</p>
                        <FontAwesomeIcon :icon="faClock" />
                    </div>
                </li>

                <li
                    class="sm:min-w-2xs hover:bg-bg-secondary rounded-2xl transition flex justify-between items-center font-semibold px-4 py-5 ">

                    <p>Currently reading :</p>
                    <div class="flex items-center justify-between gap-x-1">
                        <p>25</p>
                        <FontAwesomeIcon :icon="faBook" />
                    </div>
                </li>
                <li
                    class="sm:min-w-2xs hover:bg-bg-secondary rounded-2xl transition flex justify-between items-center text-success font-semibold px-4 py-5 ">

                    <p>Finished books: </p>
                    <div>
                        <span>100</span>
                        <FontAwesomeIcon :icon="faBook" />
                    </div>
                </li>

            </ul>
            <div class="bg-bg-main rounded-lg cursor-default mt-4 p-4">
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
            <div class="bg-bg-main rounded-lg cursor-default mt-4 p-4">
                <p class=" text-2xl font-bold mb-4 ">
                    favourite quotes :</p>
                <p class="font-semibold pl-4 py-2 italic underline bg-Shark rounded-2xl leading-relaxed">"Lorem
                    ipsum
                    dolor
                    sitamet consectetur adipisicing"

                </p>
                <p class="font-semibold pl-4 py-2 my-4 italic underline bg-Shark rounded-2xl leading-relaxed">
                    "Lorem
                    ipsum
                    dolor
                    sitamet consectetur adipisicing"

                </p>
                <p class="font-semibold pl-4 py-2 italic underline bg-Shark rounded-2xl leading-relaxed">"Lorem
                    ipsum
                    dolor
                    sitamet consectetur adipisicing"

                </p>
                <button
                    class="bg-primary w-full bg-blue-600/40 cursor-pointer  text-white py-2 px-4 mt-4 rounded-lg hover:bg-blue-600 transition">
                    Add Quote
                </button>
                <button
                    class="bg-primary w-full bg-bg-tertiary/40 cursor-pointer  text-white py-2 px-4 mt-4 rounded-lg hover:bg-bg-tertiary transition">
                    see all quotes
                </button>
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
                <article class=" flex  rounded-lg max-sm:flex-wrap  overflow-hidden bg-bg-main ">
                    <div class="max-sm:w-full relative overflow-hidden">
                        <span
                            class="max-sm:w-full -bottom-4 z-10 shadow-[0px_-20px_20px_5px_#00000063] left-0 h-px  absolute "></span>
                        <img class="min-w-40 max-sm:mx-auto h-full " src="https://picsum.photos/160/240" alt="">
                    </div>
                    <ul class="p-4 w-full ">
                        <li class="mb-1 flex justify-between items-center">
                            <h3 class=" font-semibold">Book title</h3>
                            <div class=" flex items-center gap-x-1 text-sm">
                                <p>3.5/5 </p>
                                <FontAwesomeIcon :icon="faStar" class="mr-2 text-star" />
                            </div>
                        </li>
                        <li class=" font-semibold mb-4">
                            <p>Author: John Doe</p>
                        </li>
                        <li class=" font-semibold flex items-center mb-4  flex-wrap gap-x-2">
                            <p>Genrea:</p>
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
                            <p class="font-semibold">Description:</p>
                            <p class=" max-w-[600px] ml-2">Lorem, ipsum dolor sit amet consectetur adipisicing
                                elit.
                                Eaque omnis,
                                ex quas nemo
                                ....</p>
                        </li>
                        <li class=" flex flex-wrap  font-semibold gap-4">
                            <button
                                class="bg-success cursor-pointer transition text-white py-2 px-4 rounded-lg hover:bg-green-600">
                                <FontAwesomeIcon :icon="faBook" />
                                Continue reading
                            </button>
                            <button
                                class="bg-error cursor-pointer transition text-white py-2 px-4 rounded-lg hover:bg-red-600">
                                <FontAwesomeIcon :icon="faHeart" />
                                Add to Favorites
                            </button>
                            <button
                                class="bg-warning cursor-pointer transition text-white py-2 px-4 rounded-lg hover:bg-amber-700">
                                <FontAwesomeIcon :icon="faBookmark" />
                                shelfs
                            </button>
                            <button
                                class="bg-gray-500 cursor-pointer transition text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                                <FontAwesomeIcon :icon="faEllipsis" />
                                More
                            </button>
                        </li>
                    </ul>
                </article>
                <button
                    class=" w-full p-4 text-center font-semibold bg-bg-main mt-4 rounded-2xl cursor-pointer hover:bg-gray-700 transition">
                    <p>See
                        all <span class="text-[#ddd]">(12)</span></p>
                </button>
            </div>
            <div class="mt-4   ">
                <h3
                    class="  bg-bg-main  max-sm:mx-auto mb-4 hover:bg-bg-secondary  rounded-2xl transition w-fit font-semibold text-2xl p-4  ">
                    Favorite authors :</h3>


                <CarouselCom :items-per-view="4" :show-arrows="true">
                    <SlideCom v-for="x in 8" :key="x">
                        <article
                            class="  group relative shrink-0  text-center bg-bg-main pb-4  rounded-2xl overflow-hidden  ">
                            <span
                                class=" block z-20 rounded-2xl  absolute top-0 left-0 w-full h-full  inset-0 pointer-events-none  group-hover:shadow-[0_0px_0px_8px_#a27b5c_inset] shadow-[0_0px_0px_2px_#a27b5c_inset] transition-all"></span>
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

            <div class="mt-4">
                <h3
                    class="  bg-bg-main max-sm:mx-auto mb-4 hover:bg-bg-secondary rounded-2xl transition w-fit font-semibold text-2xl p-4  ">
                    Finished books :</h3>
                <div>
                    <CarouselCom :items-per-view="4" :show-arrows="true">
                        <SlideCom v-for="x in 10" :key="x">
                            <BookCardCom :book="bookObj"></BookCardCom>
                        </SlideCom>

                    </CarouselCom>

                </div>
            </div>
        </section>

    </div>
</section>
</div>
</template>
<style scoped>
.slider {
    scrollbar-width: none;
}
</style>