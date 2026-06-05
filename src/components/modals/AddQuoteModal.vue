<script setup>
import { inject, ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useUiStore } from "@/stores/UiStore";
const closeModal = inject("closeModal");
const text = ref("");
const userStore = useUserStore();
const uiStore = useUiStore();
const addQuote = async () => {
    if (!text.value) {
        uiStore.showMessageModal("Quote cannot be empty", "error");
        return;
    };
    await userStore.addQuote(text.value);
    closeModal();
};
</script>

<template>
    <div class="bg-Shark shadow-max fixed z-40 top-3/6 left-3/6 -translate-3/6 p-4 rounded-lg">
        <h3 class="text-xl font-bold mb-4">Add Quote</h3>

        <textarea v-model="text" class="bg-bg-tertiary/30 w-full text-white p-2 rounded-lg" />

        <button class="bg-success/60 w-full text-white py-2 px-4 mt-4 rounded-lg" @click="addQuote">
            Add Quote
        </button>
    </div>
</template>