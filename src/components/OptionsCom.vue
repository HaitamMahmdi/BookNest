<script setup>
import { ref, watch } from 'vue';
import { useUserBooks } from '../stores/userBooks';
import { useScrollLock } from "../composables/useScrollControl";
import { useClickOutside } from "@/composables/useClickOutside";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBullhorn, faEyeSlash, faTrash, faShare, faCheck, faPenToSquare, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
const props = defineProps({
    containerClass: String,
    buttonClass: String,
    disableButton: Boolean,
    optionsListStyle: String,
    ignoreClass: {
        type: String,
        default: 'part'
    },
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
    hideAll: {
        type: Boolean,
        default: false,
    }
})
const emit = defineEmits(['delete', 'edit', 'share', 'report', 'hide', 'finish']);
const showOptions = ref(false);
const optionsRef = ref(null);
const openModal = () => {
    showOptions.value = true;
    lock()
}
const closeModal = () => {
    unlock()
    showOptions.value = false;
}
const { lock, unlock } = useScrollLock();
const toggleOptions = () => {
    if (showOptions.value) closeModal()
    else openModal()
};
useClickOutside(optionsRef, () => {
    if (showOptions.value) closeModal()
});
const clickOption = (option) => {
    emit(option)
    closeModal()
}

</script>
<template>
    <div ref="optionsRef" :class="props.containerClass" class="w-fit relative ">
        <button :disabled="disableButton" :class="props.buttonClass" @click="toggleOptions"
            class=" text-gray-400  hover:text-white focus:text-text-main cursor-pointer">
            <slot name="buttonContent"></slot>
            <FontAwesomeIcon v-if="!$slots.buttonContent" :icon="faEllipsisVertical" />
        </button>
        <div :class="props.optionsListStyle"
            class="w-30 absolute overflow-hidden rounded-lg  top-full mt-2 bg-Shark  shadow-lg z-10" v-if="showOptions">

            <button v-if="props.showShare && !hideAll" @click="clickOption('share')"
                class="flex w-full items-center gap-x-1 cursor-pointer text-warning py-2 px-3  transition-all hover:pl-4 hover:bg-warning/20">
                <FontAwesomeIcon :icon="faShare" />
                <span>Share</span>
            </button>
            <button v-if="props.showFinish && !hideAll" @click="clickOption('finish')"
                class="flex w-full items-center gap-x-1 cursor-pointer text-success py-2 px-3  transition-all hover:pl-4 hover:bg-success/20">
                <FontAwesomeIcon :icon="faCheck" />
                <span>finished</span>
            </button>
            <button v-if="props.showEdit && !hideAll" @click="clickOption('edit')"
                class="flex w-full items-center gap-x-1 cursor-pointer text-text-main py-2 px-3  transition-all hover:pl-4 hover:bg-[#DBEAFE]/20">
                <FontAwesomeIcon :icon="faPenToSquare" />
                <span>edit</span>
            </button>
            <button v-if="props.showHide && !hideAll" @click="clickOption('hide')"
                class="flex w-full items-center gap-x-1 cursor-pointer text-text-main py-2 px-3  transition-all hover:pl-4 hover:bg-gray-400/20">
                <FontAwesomeIcon :icon="faEyeSlash" />
                <span>Hide</span>
            </button>
            <button v-if="props.showReport && !hideAll" @click="clickOption('report')"
                class="flex items-center w-full gap-x-1 cursor-pointer text-error py-2 px-3  transition-all hover:pl-4 hover:bg-error/20">
                <FontAwesomeIcon :icon="faBullhorn" />
                <span>Report</span>
            </button>
            <button @click="clickOption('delete')" v-if="props.showDelete && !hideAll"
                class="flex w-full items-center gap-x-1 cursor-pointer text-error py-2 px-3  transition-all hover:pl-4 hover:bg-error/20">
                <FontAwesomeIcon :icon="faTrash" />
                <span>delete</span>
            </button>
            <slot :closeModal="closeModal" name="customOptions"></slot>

        </div>
    </div>


</template>