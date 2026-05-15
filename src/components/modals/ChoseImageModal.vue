<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '../../stores/userStore';
import { useScrollLock } from "@/composables/useScrollControl";
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
const props = defineProps({
    show: {
        type: Number,
        default: 0,
    },
    isFor: {
        type: String,
    }
})
const emit = defineEmits(['close', 'file-uploaded', 'image-selected'])
const userStore = useUserStore();
const coverHistory = computed(() => userStore.coverImageHistory)
const profileHistory = computed(() => userStore.profileImageHistory)
const { lock, unlock } = useScrollLock();
const container = ref(null)

const fileInput = ref(null)
const elID = ref(null)
const selectedImg = (event) => {
    const el = event.currentTarget

    if (elID.value && elID.value !== el) {
        elID.value.classList.remove('selected')
    }

    el.classList.add('selected')
    elID.value = el
}

const fileUploaded = (event) => {
    if (props.show === 1) {
        emit('file-uploaded', 'cover', event)
    } else {
        emit('file-uploaded', 'profile', event)
    }
    emit('close')
}
const changeMedia = () => {
    emit('image-selected', elID.value.id)
    emit('close')
}
onMounted(() => {
    setTimeout(() => {
        lock()
    }, 0);
})
onBeforeUnmount(() => {
    unlock()
    if (fileInput.value) {
        fileInput.value.value = null
    }
    if (elID.value) {
        elID.value.classList.remove('selected')
    }
    elID.value = null
})
</script>
<template>
    <div @click.self="emit('close'), unlock()
        " ref="container"
        v-if="props.show === 2 && props.isFor === 'profile' || props.show === 1 && props.isFor === 'cover'"
        class=" w-screen h-screen fixed left-0 flex justify-center items-center top-0   z-200 bg-shdowOverlay">
        <div class="chose-image  h-[calc(100vh-100px)]  pb-4 px-4 bg-Shark  md:w-3xl overflow-y-auto rounded-lg">
            <div class="bg-Shark py-4 sticky top-0">
                <button @click=" fileInput.click()"
                    class=" flex justify-center cursor-pointer items-center  w-full  p-2 bg-blue-500/60 hover:bg-blue-500 font-semibold transition rounded-lg">
                    <p> Upload
                        photo</p>
                    <FontAwesomeIcon :icon="faUpload" />
                    <input @change="fileUploaded" ref="fileInput" type="file" class=" hidden">
                </button>
            </div>
            <div class="mt-4 part">
                <p :class="[profileHistory.length + coverHistory.length <= 0 ? 'mb-40' : '']"
                    class="text-lg text-left font-semibold">Uploads</p>
                <ul class="mt-4 flex flex-wrap gap-4">
                    <li v-if="profileHistory" v-for="img in profileHistory" :key="img">
                        <button :id="img.id" @click="selectedImg"
                            class="w-50 aspect-square border-5 cursor-pointer  rounded-lg overflow-hidden transition ">
                            <img :src="img.url" :alt="img.id" class="w-full h-full object-cover ">
                        </button>
                    </li>
                    <li v-if="coverHistory.length" v-for="img in coverHistory" :key="img">
                        <button :id="img.id" @click="selectedImg"
                            v-if="props.isFor === 'cover' && img.width <= 400 && img.height <= 150 ? false : true"
                            class="w-50 aspect-square border-5 cursor-pointer  rounded-lg overflow-hidden transition ">
                            <img :src="img.url" :alt="img.id" class="w-full h-full object-cover ">
                        </button>
                    </li>

                </ul>
                <p :class="[profileHistory.length <= 0 ? 'mb-40' : '']" class="text-lg text-left my-4 font-semibold">
                    Profile Pictures</p>
                <ul class=" flex flex-wrap gap-4">
                    <li v-if="profileHistory.length" v-for="img in profileHistory" :key="img">
                        <button :id="img.id" @click="selectedImg"
                            v-if="props.isFor === 'cover' && img.width <= 400 && img.height <= 150 ? false : true"
                            class="w-50 aspect-square border-5 cursor-pointer  rounded-lg overflow-hidden transition ">
                            <img :src="img.url" :alt="img.id" class="w-full h-full object-cover ">
                        </button>
                    </li>
                </ul>
                <p :class="[coverHistory.length <= 0 ? 'mb-40' : '']" class="text-lg text-left my-4 font-semibold">
                    cover
                    photos</p>
                <ul class=" flex flex-wrap gap-4">
                    <li v-if="coverHistory.length" v-for="img in coverHistory" :key="img">
                        <button :id="img.id" @click="selectedImg"
                            class="w-50 aspect-square border-5  cursor-pointer rounded-lg overflow-hidden transition ">
                            <img :src="img.url" :alt="img.id" class="w-full h-full object-cover ">
                        </button>
                    </li>
                </ul>
            </div>
            <div v-if="elID" class="bg-Shark w-full flex justify-end items-center gap-4 py-4 sticky -bottom-4">
                <button @click="changeMedia" class=" cursor-pointer bg-blue-700 rounded-lg px-4 py-2">Select</button>
            </div>
        </div>

    </div>
</template>
<style>
.chose-image {
    scrollbar-width: none;
}

.selected {
    border-color: var(--color-blue-600);
}
</style>