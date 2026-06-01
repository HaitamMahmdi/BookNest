<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useClickOutside } from "@/composables/useClickOutside";
import { useScrollLock } from "@/composables/useScrollControl";
import { useUiStore } from "@/stores/UiStore";

const emit = defineEmits(["confirm", "close"]);
const uiStore = useUiStore();
const { lock, unlock } = useScrollLock();
const modal = ref(null);
onMounted(() => {
    lock()
})
onBeforeUnmount(() => {
    unlock()
})
useClickOutside(modal, () => {
    if (uiStore.areYouSureModal.onCancel) {
        uiStore.areYouSureModal.onCancel();
    } else {
        uiStore.hideAreYouSureModal();
    }
});
</script>

<template>
    <div ref="modal"
        class="fixed sm:w-xl w-[90%]  shadow-max rounded-lg p-4 top-3/6 text-text-main left-3/6 z-30 -translate-3/6  bg-Shark ">
        <h2 class="sm:text-2xl  text-lg h-fit w-[80%] mx-auto mb-4 text-center font-bold">Are you sure you want to
            delete this
            Book ?
        </h2>
        <p v-if="uiStore.areYouSureModal.description" class=" text-center mb-4 sm:w-5/6 mx-auto ">
            {{ uiStore.areYouSureModal.description }}
        </p>
        <div class=" w-full flex justify-end items-end  ml-auto">
            <button @click="uiStore.confirm()"
                class="bg-error/70 hover:bg-error   transition-colors cursor-pointer font-semibold  text-white px-4 py-2 rounded mr-2">Yes</button>
            <button @click="uiStore.cancel ? uiStore.cancel() : uiStore.hideAreYouSureModal()"
                class="bg-bg-section/70  hover:bg-bg-section transition-colors cursor-pointer font-semibold   text-white px-8  py-2 rounded">No</button>
        </div>
    </div>
</template>