<script setup>
import { useUserBooks } from '../stores/userBooks';
import OptionsCom from './OptionsCom.vue';
const userBooks = useUserBooks()
const props = defineProps({
    index: Number,
    progrees: String,
    textBody: String,
    date: String,
    bookID: String,
    thoughtID: String,
})

const deleteThought = async () => {
    await userBooks.deleteThought(props.bookID, props.thoughtID)
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
            <OptionsCom options-list-style="right-0" @delete="deleteThought" :show-hide="false" :show-report="false"
                :show-finish="false">
            </OptionsCom>
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