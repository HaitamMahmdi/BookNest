<script setup>
import { ref, provide } from "vue";
import { useScrollLock } from "@/composables/useScrollControl";
import { useClickOutside } from "@/composables/useClickOutside";
const props = defineProps({
    show: Boolean,
});
const emit = defineEmits(["close"]);
const { lock, unlock } = useScrollLock();
const modal = ref(null);
const closeModal = () => {
    emit("close");
};
useClickOutside(modal, closeModal);
provide("closeModal", closeModal);
</script>

<template>
    <div v-if="props.show" ref="modal">
        <slot />
    </div>
</template>