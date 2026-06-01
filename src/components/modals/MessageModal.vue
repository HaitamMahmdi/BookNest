<script setup>
import { faStop, faCheckCircle, faExclamationTriangle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import { useUiStore } from '@/stores/UiStore';
import { useClickOutside } from '@/composables/useClickOutside';
const uiStore = useUiStore()
const props = defineProps({
    entersFrom: {
        type: String,
        defaulted: 'top',
    }
})
const message = ref(null)
const dismissMessage = () => {
    message.value.classList.replace('enterFromTop', 'exitToTop');
    setTimeout(() => {
        uiStore.hideMessageModal()
    }, 300)
}
useClickOutside(message, dismissMessage)
</script>
<template>
    <div v-if="uiStore.messageModal.text" @click="dismissMessage" ref="message"
        :class="[uiStore.messageModal.type === 'error' ? 'font-semibold bg-error text-white' : uiStore.messageModal.type === 'success' ? 'bg-success text-white' : 'bg-warning text-white']"
        class=" flex items-center  justify-center fixed top-10 cursor-pointer max-sm:w-full max-sm:px-2 max-w-fit   min-w-2xs py-3 px-4 rounded-full gap-x-2 left-3/6 -translate-x-3/6 shadow-lg z-1000 enterFromTop">
        <FontAwesomeIcon class="mt-px"
            :icon="uiStore.messageModal.type === 'error' ? faXmarkCircle : uiStore.messageModal.type === 'success' ? faCheckCircle : faExclamationTriangle" />
        <p> {{ uiStore.messageModal.text }}</p>
    </div>
</template>

<style scoped>
.enterFromTop {
    animation-name: enterFromTop;
    animation-duration: 300ms;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;

}

@keyframes enterFromTop {
    from {
        transform: translateY(-100%);
        opacity: 0;
    }

    to {
        transform: translateY(2rem);
        opacity: 1;
    }

}

.exitToTop {
    animation-name: exitToTop;
    animation-duration: 300ms;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
    filter: brightness(150%);
}

@keyframes exitToTop {
    from {
        transform: translateY(2rem);
        opacity: 1;
    }

    to {
        transform: translateY(-100%);
        opacity: 0;
    }
}
</style>