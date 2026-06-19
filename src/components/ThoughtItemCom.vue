<script setup>
import { useUserBooks } from '../stores/userBooks';
import OptionsCom from './OptionsCom.vue';
const userBooks = useUserBooks()
const props = defineProps({
    index: Number,
    progress: Number,
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
    <li class="relative mx-auto flex w-full flex-col gap-3 rounded-lg bg-bg-main px-4 py-6     ">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-bg-secondary/70 pb-3">
            <div class="flex items-center gap-2">
                <span
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg-tertiary/15 text-sm font-semibold text-text-main">
                    {{ props.index }}
                </span>
            </div>

            <div class="flex items-center gap-1 text-sm text-text-main/90">
                <span class="font-medium">page</span>
                <span class="font-semibold">{{ props.progress }}</span>
            </div>

            <OptionsCom options-list-style="right-0 top-3/6! bg-[#424242]" @delete="deleteThought" :show-hide="false"
                :show-report="false" :show-finish="false">
            </OptionsCom>
        </div>

        <div class="flex w-full items-center justify-center rounded-xl bg-bg-main/40 px-3 py-4">
            <p :class="[props.textBody ? 'text-text-main/95' : 'font-semibold text-text-main/80']"
                class="w-full wrap-break-word whitespace-pre-wrap text-center text-sm leading-6">
                {{ props.textBody || 'You Add No Thoughts' }}
            </p>
        </div>

        <p class="border-t border-bg-secondary/70 pt-2 text-xs text-text-main/60">{{ props.date }}</p>
    </li>
</template>