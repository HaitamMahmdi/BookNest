<script setup>
import { computed, onMounted, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBookOpen,
  faChevronRight,
  faDownload,
  faDragon,
  faGhost,
  faLandmark,
  faMagnifyingGlass,
  faRobot,
  faShareNodes,
  faWandSparkles,
  faStar,
  faBookmark as bookMarkSolid,
  faBook,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark, faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import BookCardCom from "@/components/bookCard/BookCardCom.vue";
import CarouselCom from "@/components/carousel/CarouselCom.vue";
import SlideCom from "@/components/carousel/SlideCom.vue";
import SearchbarCom from "@/components/SearchbarCom.vue";
import LoadingCom from "../components/LoadingCom.vue";
import { useUserBooks } from "../stores/userBooks";
import ShowShelves from "../components/bookCard/ShowShelves.vue";
import AddNewShelfCom from "../components/bookCard/AddNewShelfCom.vue";

const userBooks = useUserBooks();
const isLoading = ref(true);
const showModal = ref(false)
const showAddNewShelfCom = ref(false)
const books = ref({
  fantasy: [],
  science_fiction: [],
  mystery: [],
  history: [],
});

const categories = [
  { key: "fantasy", label: "Fantasy", icon: faDragon, query: "subject:fantasy" },
  { key: "science_fiction", label: "Science Fiction", icon: faRobot, query: "subject:science_fiction" },
  { key: "mystery", label: "Mystery", icon: faGhost, query: "subject:mystery" },
  { key: "history", label: "History", icon: faLandmark, query: "subject:history" },
];

const currentReading = computed(() => userBooks.reading[userBooks.reading.length - 1] || null);
const latestThought = computed(() => currentReading.value?.thoughts?.at?.(-1) || null);
const currentProgress = computed(() => {
  const pageCount = currentReading.value?.book?.volumeInfo?.pageCount;
  const progress = latestThought.value?.progress;
  if (!pageCount || !progress) return null;
  return Math.min(100, Math.round((progress / pageCount) * 100));
});


async function loadBooks() {
  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  try {
    const results = await Promise.all(
      categories.map(async (category) => {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${category.query}&orderBy=newest&langRestrict=en&maxResults=10&key=${apiKey}`,
        );
        const data = await response.json();
        return [category.key, data.items || []];
      }),
    );

    books.value = Object.fromEntries(results);
  } catch (error) {
    console.error("Failed to load homepage books:", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadBooks);
</script>

<template>

  <div class="relative min-h-screen overflow-hidden  text-white ">
    <div v-if="isLoading" class=" absolute z-50 w-full h-full bg-Shark p-6">
      <LoadingCom />
    </div>

    <div class="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
      <section>
        <div class="rounded-lg border border-white/10 bg-Shark p-6 ">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.28em] text-white/45">Continue reading</p>
              <h2 class="mt-2 text-2xl font-semibold">Resume your story</h2>
            </div>
            <div class="rounded-2xl bg-bg-main px-3 py-2 text-sm font-semibold text-white">
              {{ currentProgress ?? 0 }}%
            </div>
          </div>

          <div v-if="currentReading" class="mt-5 flex flex-wrap gap-4">
            <img class="h-32 w-24 rounded-2xl object-cover shadow-lg"
              :src="currentReading.book?.volumeInfo?.imageLinks?.thumbnail || '/assets/backGrounds/authBackGround.svg'"
              :alt="currentReading.book?.volumeInfo?.title || 'Current book cover'" />
            <div class="min-w-0 flex-1">
              <p class="text-lg font-medium leading-6 line-clamp-2">{{ currentReading.book?.volumeInfo?.title }}</p>
              <p class="mt-2 text-sm text-white/60">
                Picked up from your reading list. Continue where you left off and keep your momentum going.
              </p>
              <div class="mt-4 relative">
                <RouterLink target="_blank" title="continue reading"
                  class="bg-white text-success w-fit text-center cursor-pointer transition p-2 rounded-lg "
                  :to="{ name: 'Book', params: { id: currentReading.book.id } }">
                  <FontAwesomeIcon :icon="faBook" />
                </RouterLink>
                <button :title="userBooks.isInShelfGetter('', currentReading.book.id) ? 'Show shelves' : 'Add to shelf'"
                  @click="showModal = true"
                  :class="[userBooks.isInShelfGetter('', currentReading.book.id) ? 'bg-white text-warning ' : 'bg-warning  text-white  hover:bg-amber-700 ']"
                  class="cursor-pointer mx-2 w-fit  transition  p-2  rounded-lg ">
                  <FontAwesomeIcon
                    :icon="userBooks.isInShelfGetter('', currentReading.book.id) ? bookMarkSolid : faBookmark" />
                </button>
                <ShowShelves :class="' -top-45 -left-28 -translate-x-28'" @close-shelves-com="showModal = false"
                  @open-add-new-shelf-com="showAddNewShelfCom = true" :book="currentReading.book" v-if="showModal">
                </showShelves>
                <button
                  @click="userBooks.isFavorite(currentReading.book.id) ? userBooks.removeFromFavorites(currentReading.book.id) : userBooks.addToFavorites(currentReading.book)"
                  :class="[userBooks.isFavorite(currentReading.book.id) ? 'bg-white text-error' : 'bg-error text-white  hover:bg-red-600 ']"
                  class="bg-error w-fit cursor-pointer transition p-2 rounded-lg">

                  <FontAwesomeIcon v-if="!userBooks.isFavorite(currentReading.book.id)" :icon="faHeartRegular" />
                  <FontAwesomeIcon class="" v-else :icon="faHeart" />
                </button>
              </div>
            </div>
            <div class="w-full">
              <RouterLink :to="{ name: 'Book', params: { id: currentReading.book?.id } }"
                class="mt-4 max-md:w-full max-md:justify-center inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:border-white/20 hover:bg-white/10">
                <FontAwesomeIcon :icon="faBookOpen" />
                <p> Open reading view</p>
              </RouterLink>
            </div>

          </div>

          <div v-else
            class="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-sm leading-6 text-white/65">
            Add a book to your reading list to see a continue-reading card here.
          </div>
        </div>
      </section>
      <section class="mt-10 space-y-10">

        <article v-for="category in categories" :key="category.key" class="rounded-lg  bg-Shark p-5   sm:p-6">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 mb-4">
              <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-bg-main text-white">
                <FontAwesomeIcon :icon="category.icon" />
              </span>
              <div>
                <h2 class="text-xl font-semibold">{{ category.label }}</h2>
                <p class="text-sm text-white/55">Hand-picked suggestions for this section.</p>
              </div>
            </div>
            <button
              class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/10">
              See More
              <FontAwesomeIcon :icon="faChevronRight" />
            </button>
          </div>

          <CarouselCom v-if="!isLoading" class="mt-6" :itemsPerView="4">
            <SlideCom v-for="book in books[category.key]" :key="book.id">
              <BookCardCom :book="book" />
            </SlideCom>
          </CarouselCom>
        </article>
      </section>
    </div>
    <AddNewShelfCom v-if="showAddNewShelfCom" @close="showAddNewShelfCom = false" />
  </div>
</template>
