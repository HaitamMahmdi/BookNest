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
    <li class="flex flex-col justify-between w-full mx-auto  px-4  bg-Shark">
        <div class=" flex justify-between items-center border-b border-bg-secondary py-2">
            <p>{{ props.index }}</p>
            <div class="flex gap-x-1">
                <p>page number:</p>
                <p>{{
                    props.progrees }}</p>
            </div>
            <OptionsCom options-list-style="right-0 top-3/6! bg-[#424242]" @delete="deleteThought" :show-hide="false"
                :show-report="false" :show-finish="false">
            </OptionsCom>
        </div>


        <div class="flex w-full items-center flex-col px-2 py-3 ">

            <p :class="[props.textBody ? '' : 'font-semibold']" class=" break-all mt-2 text-center ">{{ props.textBody
                ||
                `you add no thoughts` }}</p>
        </div>
        <p class=" border-t py-2 border-bg-secondary">{{ props.date }}</p>
    </li>
</template>