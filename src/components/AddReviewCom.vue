<script setup>
import { onMounted, onUnmounted, reactive, ref, useTemplateRef } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useUserBooks } from "../stores/userBooks";
const emit = defineEmits('submit')
const props = defineProps({
  bookID: {
    type: String,
    required: true,
  },
});
const userBooks = useUserBooks()
const star = ref([null]);
const reviewObj = reactive({
  title: "",
  body: "",
  rating: 0,
  date: '',
});
const errorMessage = ref("");

const changeStare = (e) => {
  errorMessage.value = ''
  const starId = e.target.closest("svg").id;
  const starIndex = parseInt(starId.replace("star", ""));
  for (let i = 0; i < star.value.length; i++) {
    if (i <= starIndex) {
      star.value[i]?.$el.classList.add("text-yellow-400");
    } else {
      star.value[i]?.$el.classList.remove("text-yellow-400");
    }
  }
reviewObj.rating = starIndex;
};
const addnewReview = async () => {
  if(!reviewObj.title || !reviewObj.body || reviewObj.rating === 0){
    errorMessage.value = "Please fill in all required fields and select a star rating";
    return;
  }
const date = new Date()
reviewObj.date = `${date.getFullYear}-${date.getMonth}-${date.getDay}`
 await userBooks.addNewReview(props.bookID, reviewObj);
  errorMessage.value = "";
 emit('submitReview')
}
</script>
<template>
  <form
  id="reviewCom"
    @submit.prevent
    class="w-3/4 text-text-main bg-Shark fixed z-20 p-4 rounded-lg shadow-max top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <div class="flex items-center gap-x-px mb-2">
      <p class="mr-4 text-lg">add star count:</p>
      <FontAwesomeIcon
        @click="changeStare"
        v-for="(star, index) in 5"
        :key="star"
        ref="star"
        :id="`star${index + 1}`"
        class="cursor-pointer"
        :icon="faStar"
      />
    </div>
    <div>
      <label for="review" class="text-lg mb-2 block">title:</label>
      <input
        type="text"
        @focus="errorMessage=''"
        id="review"
        v-model="reviewObj.title"
        placeholder="title"
        class="w-full p-2 bg-bg-main rounded mb-4 border border-transparent focus:border-text-main"
      />
    </div>
    <div>
      <label for="review-body" class="text-lg mb-2 block">Your Review:</label>
      <textarea
              @focus="errorMessage=''"

        type="text"
        v-model="reviewObj.body"
        id="review-body"
        placeholder="Write your review here..."
        class="w-full p-2 bg-bg-main rounded mb-4 border border-transparent max-h-36 min-h-36 focus:border-text-main"
      >
      </textarea>
    </div>
    <input
    @click="addnewReview"
      type="submit"
      class="bg-green-400 cursor-pointer text-text-main px-4 py-2 rounded hover:bg-green-500 transition-colors"
    >
    </input>
    <p class=" mx-auto mt-2 text-lg text-center text-error font-semibold">{{errorMessage}}</p>
  </form>
</template>
