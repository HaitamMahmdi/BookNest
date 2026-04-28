<script setup>
import { ref } from 'vue';
import { useUserBooks } from '../stores/userBooks';
import { useScrollLock } from "../composables/useScrollControl";
import { useClickOutside } from "@/composables/useClickOutside";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBullhorn, faEyeSlash, faTrash, faShare, faCheck, faPenToSquare, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
const props = defineProps({
    showReport: {
        type: Boolean,
        default: true,
    },
    showFinish: {
        type: Boolean,
        default: true,
    },
    showDelete: {
        type: Boolean,
        default: true,
    },
    showEdit: {
        type: Boolean,
        default: true,
    },
    showShare: {
        type: Boolean,
        default: true,
    },
    showHide: {
        type: Boolean,
        default: true,
    },
})
const emit = defineEmits(['delete', 'edit', 'share', 'report', 'hide', 'finish']);
const showOptions = ref(false);
const optionsRef = ref(null);
const openModal = () => {
    showOptions.value = true;
    lock()
}
const closeModal = () => {
    showOptions.value = false;
    unlock()
}
const { lock, unlock } = useScrollLock();
const toggleOptions = () => {
    if (showOptions.value) closeModal()
    else openModal()
};
useClickOutside(optionsRef, () => {
    console.log('clicked outside');
    if (showOptions.value) closeModal()
});
</script>
<template>
    <div class="relative w-fit" id="part">
        <button id="part" @click="toggleOptions" class=" text-gray-400  hover:text-white cursor-pointer">
            <FontAwesomeIcon id="part" :icon="faEllipsisVertical" />
        </button>
        <div class="w-30 absolute left-0 top-full mt-2 bg-Shark  shadow-lg z-10" v-if="showOptions" ref="optionsRef">

            <button v-if="props.showShare" @click="emit('share')"
                class="flex w-full items-center gap-x-1 cursor-pointer text-warning py-1 px-2  transition-all hover:pl-4 hover:bg-warning/20">
                <FontAwesomeIcon :icon="faShare" />
                <span>Share</span>
            </button>
            <button v-if="props.showFinish" @click="emit('finish')"
                class="flex w-full items-center gap-x-1 cursor-pointer text-success py-1 px-2  transition-all hover:pl-4 hover:bg-successbg/20">
                <FontAwesomeIcon :icon="faCheck" />
                <span>finished</span>
            </button>
            <button v-if="props.showEdit" @click="emit('edit')"
                class="flex w-full items-center gap-x-1 cursor-pointer text-text-main py-1 px-2  transition-all hover:pl-4 hover:bg-[#DBEAFE]/20">
                <FontAwesomeIcon :icon="faPenToSquare" />
                <span>edit</span>
            </button>
            <button v-if="props.showHide" @click="emit('hide')"
                class="flex w-full items-center gap-x-1 cursor-pointer text-text-main py-1 px-2  transition-all hover:pl-4 hover:bg-gray-400/20">
                <FontAwesomeIcon :icon="faEyeSlash" />
                <span>Hide</span>
            </button>
            <button v-if="props.showReport" @click="emit('report')"
                class="flex items-center w-full gap-x-1 cursor-pointer text-error py-1 px-2  transition-all hover:pl-4 hover:bg-error/20">
                <FontAwesomeIcon :icon="faBullhorn" />
                <span>Report</span>
            </button>
            <button @click="emit('delete')" v-if="props.showDelete"
                class="flex w-full items-center gap-x-1 cursor-pointer text-error py-1 px-2  transition-all hover:pl-4 hover:bg-error/20">
                <FontAwesomeIcon :icon="faTrash" />
                <span>delete</span>
            </button>


        </div>
    </div>


</template>