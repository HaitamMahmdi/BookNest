<script setup>
import { faStop, faCheckCircle, faExclamationTriangle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import { useMessageStore } from '@/stores/MessageStore';
import { useClickOutside } from '@/composables/useClickOutside';
const messageStore = useMessageStore()
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
        messageStore.dismissMessage()
    }, 300)
}
useClickOutside(message, dismissMessage)
</script>
<template>
    <div v-if="messageStore.messageText" @click="dismissMessage" ref="message"
        :class="[messageStore.messageType === 'error' ? 'font-semibold bg-error text-white' : messageStore.messageType === 'success' ? 'bg-success text-white' : 'bg-warning text-white']"
        class=" flex items-center  justify-center fixed top-10 cursor-pointer max-sm:w-full max-sm:px-2 max-w-fit   min-w-2xs py-3 px-4 rounded-full gap-x-2 left-3/6 -translate-x-3/6 shadow-lg z-1000 enterFromTop">
        <FontAwesomeIcon class="mt-px"
            :icon="messageStore.messageType === 'error' ? faXmarkCircle : messageStore.messageType === 'success' ? faCheckCircle : faExclamationTriangle" />
        <p> {{ messageStore.messageText }}</p>
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