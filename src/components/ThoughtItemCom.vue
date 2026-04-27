<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEllipsisVertical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useScrollLock } from "@/composables/useScrollControl";
import { useClickOutside } from "@/composables/useClickOutside";
import { useUserBooks } from '../stores/userBooks';
const userBooks = useUserBooks()
const props = defineProps({
    index: Number,
    progrees: String,
    textBody: String,
    date: String,
    bookID: String,
    thoughtID: String,
})
const { lock, unlock } = useScrollLock();
const showOption = ref(false)
const option = ref(null)
useClickOutside(option, () => {
    if (showOption.value) {
        closeOption()
    }
})
const toggleOption = (e) => {
    if (!showOption.value) {
        lock()
        showOption.value = true
    }
}
const closeOption = () => {
    if (!showOption.value) return
    showOption.value = false
    unlock()
}
const delteThought = async () => {
    await userBooks.deleteThought(props.bookID, props.thoughtID)
    showOption.value = false
    unlock()
}
</script>
<template>
    <li class="max-w-2xl mx-auto  mb-1 px-4 py-2 bg-Shark">
        <div class=" flex justify-between items-center border-b border-bg-secondary py-2">
            <p>{{ props.index }}</p>
            <div class="flex gap-x-1">
                <p>page number:</p>
                <p>{{
                    props.progrees }}</p>
            </div>
            <button id="part"
                class="relative w-6 cursor-pointer block transition hover:bg-bg-secondary focus:bg-bg-secondary rounded-full aspect-square"
                @click="toggleOption">
                <FontAwesomeIcon id="part" :icon="faEllipsisVertical" />
                <div v-if="showOption" ref="option" class="absolute right-2 top-10 bg-bg-main rounded-md shadow-lg p-2">
                    <button @click="delteThought" class=" flex w-full items-center gap-x-1 cursor-pointer text-error py-1 px-4 rounded-md
                            hover:bg-error/20">
                        <FontAwesomeIcon :icon="faTrash" />
                        <span>delete</span>
                    </button>

                </div>
            </button>
        </div>


        <div class="flex w-full items-center flex-col px-2 py-3 ">
            <p>youur thought:</p>
            <p :class="[props.textBody ? '' : 'font-semibold']" class=" break-all mt-2 text-center ">{{ props.textBody
                ||
                `you add no thoughts` }}</p>
        </div>
        <p class=" border-t border-bg-secondary">{{ props.date }}</p>
    </li>
</template>