<script setup>
import { reactive, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useUserBooks } from "@/stores/userBooks";
import { useUiStore } from "@/stores/uiStore";

const props = defineProps({
  bookID: {
    type: String,
    required: true,
  },
});

const userBooks = useUserBooks();
const uiStore = useUiStore();
const star = ref([null]);
const reviewObj = reactive({
  title: "",
  body: "",
  rating: 0,
  date: "",
});

const changeStare = (e) => {
  const svg = e.target.closest("svg");
  if (!svg) return;

  const starIndex = parseInt(svg.id.replace("star", ""), 10);
  const icons = star.value
    .map((item) => item?.$el)
    .filter(Boolean);

  icons.forEach((icon, index) => {
    icon.classList.toggle("text-yellow-400", index < starIndex);
  });

  reviewObj.rating = starIndex;
};

const addNewReview = async () => {
  if (!reviewObj.title || !reviewObj.body || reviewObj.rating === 0) {
    uiStore.showMessageModal("Please fill in all required fields and select a star rating", "error");
    return;
  }

  const date = new Date();
  reviewObj.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  console.log(reviewObj)
  await userBooks.addNewReview(props.bookID, reviewObj);
};
</script>

<template>

  <form id="reviewCom" @submit.prevent class="w-full mx-auto max-w-2xl rounded-2xl  text-text-main ">
    <div class="mb-3 flex items-center gap-x-px">
      <p class="mr-4 text-lg">Add star count:</p>
      <FontAwesomeIcon @click="changeStare" v-for="(item, index) in 5" :key="index" ref="star" :id="`star${index + 1}`"
        class="cursor-pointer" :icon="faStar" />
    </div>
    <div>
      <label for="review" class="mb-2 block text-lg">Title:</label>
      <input type="text" id="review" v-model="reviewObj.title" placeholder="title"
        class="mb-4 w-full rounded border border-transparent bg-bg-main p-2 focus:border-text-main" />
    </div>
    <div>
      <label for="review-body" class="mb-2 block text-lg">Your Review:</label>
      <textarea v-model="reviewObj.body" id="review-body" placeholder="Write your review here..."
        class="min-h-36 max-h-36 w-full rounded border border-transparent bg-bg-main p-2 focus:border-text-main">
        </textarea>
    </div>
    <button type="submit" @click="addNewReview"
      class="mt-4 rounded bg-green-400 w-full px-4 py-2 text-text-main transition-colors hover:bg-green-500">
      Submit
    </button>
  </form>
</template>
