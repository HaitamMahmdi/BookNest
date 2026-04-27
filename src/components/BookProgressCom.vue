<script setup>
import { ref, computed } from "vue";
import { useUserBooks } from "../stores/userBooks";
import ThoughtItemCom from "./ThoughtItemCom.vue";
const props = defineProps({
  pagesCount: Number,
  bookID: String,
  currentPage: Number
});

const userBooks = useUserBooks()
const thoughts = computed(() => userBooks.reading.find((book) => book.id === props.bookID))
const isFinisedBook = computed(() => userBooks.isFinisedBook(props.bookID))
const value = ref(props.currentPage || 0);

const percentage = computed(() => {
  if (!props.pagesCount) return "0%";
  return `${Math.round((value.value / props.pagesCount) * 100)}%`;
});
const showPreviousThoughts = ref(false)
const words = ref("");
const newProgrees = async () => {
  if (props.bookID) {
    await userBooks.updateProgrees(props.bookID, { progrees: value.value, thought: words.value, })
  } else {
    console.error('no id was provided ')
  }

}
</script>
<template>
  <form @submit.prevent class="text-text-main">
    <h3 class="text-lg">your progress :</h3>
    <div class=" relative">
      <span class=" absolute block -top-4 right-0">{{ value }}/{{ props.pagesCount }}</span>
      <input :disabled="isFinisedBook" :value="isFinisedBook ? value = props.pagesCount : value" type="range" min="0"
        :max="pagesCount" v-model="value" :style="{
          '--value': percentage
        }" </div>
      <div class="relative bg-Shark mt-4 rounded-lg overflow-hidden">
        <input class="w-full peer py-2 pl-4 pr-18 bg-transparent rounded " v-model="words" @paste.prevent @beforeinput="
          (e) =>
            words.length === 150 && e.inputType.startsWith('insert')
              ? e.preventDefault()
              : ''
        " placeholder="your thoughts after today's reading..." type="text" max="150" />
        <span :class="[words.length === 150 ? 'text-error' : 'text-[#DDD] ']"
          class="text-sm absolute right-4 top-3/6 transform -translate-y-1/2">
          {{ words.length }}/150
        </span>

        <span class="w-0 peer-focus:w-full transition-all duration-150 bottom-0 h-0.5 bg-amber-50 block"></span>
      </div>
      <div class=" flex flex-wrap items-center justify-center gap-x-2 w-full  mt-8">
        <input type="submit" @click="newProgrees"
          class="bg-green-400 cursor-pointer max-sm:w-full max-sm:mb-4  text-text-main px-16 block py-2 rounded hover:bg-green-500 transition-colors" />
        <input @click="showPreviousThoughts = !showPreviousThoughts" type="button"
          :value="showPreviousThoughts && thoughts.reading.length ? 'hide previous thoughts' : 'see previous thoughts'"
          class="bg-neutral-800 cursor-pointer text-text-main px-16  block py-2 rounded hover:bg-neutral-700 transition-colors">
        <div class="w-full " v-if="showPreviousThoughts">
          <div class="mt-8 mx-auto" v-if="showPreviousThoughts">
            <ul>
              <ThoughtItemCom v-for="(thought, index) in thoughts.reading" :key="thought" :index="index + 1"
                :textBody="thought.thought" :progrees="thought.progrees" :date="thought.date" :bookID="props.bookID"
                :thoughtID="thought.id" </ThoughtItemCom>
            </ul>
          </div>
        </div>
      </div>
  </form>
</template>
<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 0.3rem;
  border-radius: 1rem;
  cursor: pointer;

  background: linear-gradient(to right,
      hsl(120, 97%, 71%) 0%,
      hsl(140, 100%, 65%) var(--value),
      black var(--value),
      black 100%);
}

/* Track */
input[type="range"]::-webkit-slider-runnable-track {
  height: 0.3rem;
  background: transparent;
}

/* Thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 1rem;
  height: 1rem;
  background: white;
  border-radius: 50%;
  margin-top: -0.35rem;
  border: none;
}

/* Firefox */
input[type="range"]::-moz-range-track {
  height: 0.3rem;
  background: transparent;
}

input[type="range"]::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  background: white;
  border-radius: 50%;
  border: none;
}
</style>
