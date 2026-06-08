<script setup>
import { ref, provide } from "vue";
import { useScrollLock } from "@/composables/useScrollControl";
import { useClickOutside } from "@/composables/useClickOutside";
const props = defineProps({
    show: Boolean,
    position: {
        type: String,
        default: "center",
    },
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
    <div :class="[
        props.position === 'center' ? 'top-3/6 left-3/6 -translate-3/6' :
            props.position === 'left' ? 'top-3/6 left-4 -translate-y-3/6' :
                props.position === 'right' ? 'top-3/6 right-4 -translate-y-3/6' :
                    props.position === 'topLeft' ? 'top-4 left-4' :
                        props.position === 'bottomLeft' ? 'bottom-4 left-4' :
                            props.position === 'topRight' ? 'top-4 right-4' :
                                props.position === 'bottomRight' ? 'bottom-4 right-4' :
                                    props.position === 'topCenter' ? 'top-4 left-3/6 -translate-x-3/6' :
                                        props.position === 'bottom' ? 'bottom-4 left-3/6 -translate-x-3/6' :
                                            'top-3/6 right-4',
        'fixed z-40  shadow-max rounded-lg',
    ]" v-if="props.show" ref="modal">
        <slot />
    </div>
</template>