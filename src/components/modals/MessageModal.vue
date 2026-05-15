<script setup>
import { faStop, faCheckCircle, faExclamationTriangle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
const emit = defineEmits(['close'])
const props = defineProps({
    showMessage: {
        type: Boolean,
        default: false,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    entersFrom: {
        type: String,
        defaulted: 'top',
    }
})
const message = ref(null)
const dismissMessage = () => {
    if (!message.value) return
    message.value.classList.replace('enterFromTop', 'exitToTop');
    setTimeout(() => {
        emit('close')
    }, 300)
}

</script>
<template>
    <div>
        <div @click="dismissMessage" ref="message" v-if="props.showMessage"
            :class="[props.type === 'error' ? 'font-semibold bg-error text-white' : props.type === 'success' ? 'bg-success text-white' : 'bg-warning text-white']"
            class=" flex   items-center justify-center cursor-pointer text-lg max-sm:w-full max-sm:px-2   min-w-2xs py-3 px-4 rounded-full gap-x-2 absolute  left-1/2 -translate-x-1/2 shadow-lg z-1000 enterFromTop">
            <FontAwesomeIcon class="mt-px "
                :icon="props.type === 'error' ? faXmarkCircle : props.type === 'success' ? faCheckCircle : faExclamationTriangle" />
            <p> {{ props.message }}</p>

        </div>
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