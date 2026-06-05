<script setup>
/***
 * !TODO:- make the profile editable by the user and allow them to change  name, bio, etc.
 * !TODO:- add a section for the user's friends and allow them to add/remove friends, see their friends' profiles, etc.
 * !TODO:- add a section for the user's favorite books and allow them to add/remove books from their favorites, see their favorite books, etc.
 * !TODO:- add a section for the user's reading history and allow them to see the books they've read, the books they're currently reading, etc.
 * !TODO:- allow the user to add/remove quotes, see his favorite quotes, etc.
 * !TODO:- add/remove authors from their favorites, etc.
 */
import { computed, reactive, ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEllipsis, faCamera, faImage, faUpload, faSortDown } from '@fortawesome/free-solid-svg-icons';
import OptionsCom from '@/components/OptionsCom.vue';
import { useScrollLock } from '@/composables/useScrollControl';
import { nextTick } from 'vue';
import { useUserBooks } from '@/stores/userBooks';
import { useUserAuth } from '@/stores/userAuth';
import { useUserStore } from '@/stores/userStore';
import { useRoute } from 'vue-router';

import ChangeCoverModal from '@/components/modals/ChangeCoverModal.vue';
import ChoseImageModal from '@/components/modals/ChoseImageModal.vue';
import LoadingCom from '@/components/LoadingCom.vue';
import { RouterView } from 'vue-router';
const userStore = useUserStore();
const coverUrl = computed(() => userStore.coverURL)
const profileUrl = computed(() => userStore.profileImgURL)
const coverHistory = computed(() => userStore.coverImageHistory)
const profileHistory = computed(() => userStore.profileImageHistory)

const userBooks = useUserBooks();
const messageKey = ref(0)
const userAuth = useUserAuth();
const route = useRoute();
const profileId = computed(() => route.params.id);

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
const isSettingCoverImg = ref(false)
const isSettingProfileImg = ref(false)

const imageValidator = (type, file) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"]
    if (!file) {
        previewUrl.coverUrl = null
        return false
    }
    if (!allowedTypes.includes(file.type)) {
        messageStore.updateMessage('Please upload a valid image file (PNG, JPEG, WebP)', 'error')
        return false
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
        if (type === 'cover') {
            if (img.width < 400 || img.height < 150) {
                URL.revokeObjectURL(url)
                return false
            }

        } else {
            if (img.width < 180 || img.height < 180) {
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
        previewUrl.coverUrl = null
        isSettingCoverImg.value = false
    }
}
const setNewProfileImg = async () => {
    if (selectedFile.value) {
        isSettingProfileImg.value = true
        const success = await userStore.updateProfileMedia(selectedFile.value, "profile")
        previewUrl.profileUrl = null
        isSettingProfileImg.value = false
    }
}
const imgSelectedForProfile = async (id) => {
    isSettingProfileImg.value = true
    const success = await userStore.changeProfileMedia(id)
    isSettingProfileImg.value = false
}
const imgSelectedForCover = async (id) => {
    isSettingCoverImg.value = true
    const success = await userStore.changeCoverMedia(id)
    isSettingCoverImg.value = false
}
</script>
<template>
    <div class=" text-white">

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
                                </ChoseImageModal>
                            </button>

                        </div>
                        <h2 class="text-2xl text-center font-bold mt-4">John Doe</h2>
                        <p class="text-gray-600 text-center">Book Enthusiast</p>
                    </div>
                </div>

            </div>
        </section>
        <section class="profileInfo relative z-20 mt-40 container mx-auto border-t border-bg-secondary ">
            <ul class=" flex flex-wrap max-lg:justify-center">
                <li class=" hover:bg-gray-700 transition cursor-pointer rounded-lg">
                    <RouterLink class="p-4 block" :to="{ name: 'ProfileMain', params: { id: profileId } }">
                        <p>All</p>
                    </RouterLink>
                </li>
                <li class=" hover:bg-gray-700 transition cursor-pointer rounded-lg max-sm:hidden">
                    <RouterLink class="p-4 block" :to="{ name: 'CurrentlyReading', params: { id: profileId } }">
                        <p>Currently Reading</p>
                    </RouterLink>
                </li>
                <li class=" hover:bg-gray-700 transition cursor-pointer rounded-lg  max-sm:hidden">
                    <p class="p-4">Friends</p>
                </li>
                <li class=" hover:bg-gray-700 transition cursor-pointer rounded-lg max-md:hidden">
                    <p class="p-4 h-full">Favorite books & quotes</p>
                </li>
                <li class="  hover:bg-gray-700 transition cursor-pointer rounded-lg max-md:hidden">
                    <p class="p-4">About</p>
                </li>
                <li class=" md:hidden translate-x-3/8  ">
                    <button class=" ">
                        <OptionsCom
                            :button-class="`hover:bg-gray-700 transition cursor-pointer rounded-lg hover:bg-gray-700 p-4 flex items-center gap-x-2 text-white  focus:bg-gray-700`"
                            :options-list-style="`right-3/6! z-100! translate-x-[27.6%] bg-bg-main  shadow-max rounded-lg  p-2 min-w-[300px]`"
                            :hide-all="true">
                            <template #buttonContent>
                                <FontAwesomeIcon :icon="faSortDown" />
                                <p>More</p>
                            </template>
                            <template #customOptions>
                <li class="p-4 hover:bg-gray-700 sm:hidden transition cursor-pointer rounded-lg">
                    <p>Currently Reading</p>
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
<router-view></router-view>

</div>

</template>
<style scoped>
.slider {
    scrollbar-width: none;
}
</style>