<template>
    <div v-if="visible" class="loader-wrapper">
        <div class="spinner"></div>
        <p v-if="text" class="loader-text">{{ text }}</p>
    </div>
</template>

<script setup>
defineProps({
    visible: {
        type: Boolean,
        default: true,
    },
    text: {
        type: String,
        default: "Loading...",
    },
});
</script>

<style scoped>
.loader-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

/* Spinner */
.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    /* light gray */
    border-top: 4px solid #3b82f6;
    /* blue */
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* Text */
.loader-text {
    margin-top: 10px;
    font-size: 14px;
    color: #555;
}

/* Animation */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>