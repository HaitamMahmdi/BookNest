<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faArrowUpRightFromSquare,
    faBook,
    faBookmark,
    faBookOpen,
    faCheck,
    faHeart as faHeartSolid,
    faPenToSquare,
    faShareFromSquare,
    faStar,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

import BookCardCom from "@/components/bookCard/BookCardCom.vue";
import ReviewBoxCom from "../components/ReviewBoxCom.vue";
import AddReviewCom from "../components/AddReviewCom.vue";
import BookProgressCom from "../components/BookProgressCom.vue";
import AddNewShelfCom from "../components/bookCard/AddNewShelfCom.vue";
import ShowShelves from "../components/bookCard/ShowShelves.vue";
import LoadingCom from "../components/LoadingCom.vue";
import OptionsCom from "../components/OptionsCom.vue";
import CarouselCom from "@/components/carousel/CarouselCom.vue";
import SlideCom from "@/components/carousel/SlideCom.vue";

import { useUserBooks } from "../stores/userBooks";
import { useUserAuth } from "../stores/userAuth";
import { useUiStore } from "../stores/uiStore.js";
const userBooks = useUserBooks();
const userAuth = useUserAuth();
const uiStore = useUiStore()
const router = useRouter();

const book = ref(null);
const similarBooks = ref([]);
const showModal = ref(false);
const showAddNewShelfCom = ref(false);

const readingProgress = computed(() => {
    const currentBook = book.value.id

    if (userBooks.reading.length && currentBook) {
        for (const item of userBooks.reading) {
            if (item.book.id === currentBook && item.Thoughts) {
                return item.Thoughts[item.Thoughts.length - 1]
            }
        }
    }
    return []
})

function getCategories(bookData) {
    const rawCategories = bookData?.volumeInfo?.categories || [];
    const flatCategories = rawCategories.flatMap((category) => category.split("/"));
    return [...new Set(flatCategories.map((category) => category.trim()).filter(Boolean))];
}

function hashString(value) {
    return value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function getGenreColor(genre) {
    const seed = hashString(genre);
    const hue = seed % 360;
    const saturation = 62 + (seed % 12) * 2;
    const lightness = 48 + (seed % 8) * 2;
    return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function getGenreStyle(genre) {
    return {
        backgroundColor: getGenreColor(genre),
        color: "#fff",
    };
}

async function loadBook() {
    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
    const resp = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${router.currentRoute.value.params.id}?key=${apiKey}`,
    );
    const data = await resp.json();
    book.value = data;
}

async function loadSimilarBooks(category) {
    if (!category) {
        similarBooks.value = [];
        return;
    }

    try {
        const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
        const resp = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&orderBy=relevance&langRestrict=en&maxResults=20&key=${apiKey}`,
        );
        const data = await resp.json();
        similarBooks.value = data.items || [];
    } catch (error) {
        console.error("Failed to fetch similar books:", error);
    }
}

onMounted(async () => {
    await loadBook();
});

watch(
    () => book.value?.volumeInfo?.title,
    (title) => {
        document.title = title ? `${title} - BookNest` : "BookNest";
    },
    { immediate: true },
);

watch(
    () => book.value?.id,
    async () => {
        const categories = getCategories(book.value);
        await loadSimilarBooks(categories[0]);
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    document.title = "BookNest";
});

const categories = computed(() => getCategories(book.value));
const isFinishedBook = computed(() => userBooks.isFinishedBook(book.value?.id));
const isReading = computed(() => userBooks.isReading(book.value?.id));
const userReview = computed(() => userBooks.reviews.find((review) => review.bookID === book.value?.id));
const thoughts = computed(() => {
    const currentBook = book.value?.id;
    if (!currentBook) return [];

    if (isFinishedBook.value) {
        const finishedBook = userBooks.finishedBooks.find((entry) => entry.book.id === currentBook);
        return finishedBook?.thoughts || [];
    }

    const readingBook = userBooks.reading.find((entry) => entry.book.id === currentBook);
    return readingBook?.thoughts || [];
});

const currentThought = computed(() => thoughts.value.at(-1) || null);
const currentProgress = computed(() => currentThought.value?.progress || 0);
const pageCount = computed(() => book.value?.volumeInfo?.pageCount || 0);
const ratingCount = computed(() => book.value?.volumeInfo?.ratingsCount || 0);
const averageRating = computed(() => book.value?.volumeInfo?.averageRating || 0);
const primaryCategory = computed(() => categories.value[0] || "Book detail");
const readingStateLabel = computed(() => {
    if (isFinishedBook.value) return "Finished";
    if (isReading.value) return "Reading now";
    return "Ready to read";
});

const quickFacts = computed(() => [
    { label: "Pages", value: pageCount.value || "-" },
    { label: "Rating", value: ratingCount.value ? `${averageRating.value}/5` : "No ratings" },
    { label: "Publisher", value: book.value?.volumeInfo?.publisher || "Unknown" },
    { label: "Language", value: book.value?.volumeInfo?.language || "Unknown" },
]);

const shareBook = async () => {
    if (!book.value) return;

    const shareUrl = window.location.href;
    const shareTitle = book.value.volumeInfo?.title || "BookNest book";
    const shareText = `Take a look at ${shareTitle} on BookNest.`;

    if (navigator.share) {
        try {
            await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
            return;
        } catch (error) {
            console.error("Share canceled or failed:", error);
        }
    }

    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
    }
};


const confirmDeleteFinishedBook = async (closeModal) => {
    uiStore.showAreYouSureModal(
        "Confirm Action",
        "Are you sure you want to delete this finished book ? all your reading progress and thoughts will be deleted ",
        () => {
            userBooks.deleteFinishedBook(book.value.id)
            closeModal()
        },
        () => uiStore.hideAreYouSureModal()
    );

}

</script>

<template>
    <div v-if="!book" class="flex h-screen w-full items-center justify-center">
        <LoadingCom />
    </div>

    <div v-else class="relative min-h-screen overflow-hidden px-4 py-6 text-text-main sm:px-6 lg:px-8">

        <div class="container mx-auto max-w-7xl space-y-8">
            <section class=" lg:grid gap-6 grid-cols-[1.1fr_0.9fr]">
                <article class="rounded-lg border border-bg-section/10 bg-bg-section/5 p-5   sm:p-6 lg:p-8">

                    <div class="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
                        <div class="relative mx-auto w-full max-w-[280px]">
                            <div v-if="readingProgress.progress || isFinishedBook" title="reading progress"
                                :class="[isFinishedBook ? 'text-white bg-success' : 'text-success bg-bg-white']"
                                class=" absolute w-fit rounded-br-lg  font-bold  left-0 top-0   flex flex-col justify-center items-center  p-4 text-lg ">
                                <p v-if="readingProgress.progress && !isFinishedBook">RP: {{
                                    Number.parseInt(readingProgress.progress * 100 /
                                        book.volumeInfo.pageCount) }}%
                                </p>
                                <p v-if="isFinishedBook && !readingProgress.progress">RP: 100%</p>
                            </div>
                            <OptionsCom :show-delete="false" :show-edit="false"
                                :container-class="`absolute! top-2 flex items-center justify-center rounded-full right-2`"
                                :showFinish="false" :showHide="false"
                                button-class="hover:bg-Shark bg-Shark/70 w-10! focus:bg-Shark aspect-square rounded-full"
                                :options-list-style="`right-0`">
                                <template #customOptions="{ closeModal }">
                                    <button @click=" uiStore.showAreYouSureModal(
                                        `Confirm Action`,
                                        `Are you sure you want to stop reading this book ? all your reading progress and thoughts will be deleted`,
                                        () => {
                                            userBooks.stopReading(book?.id)
                                            closeModal();
                                        },
                                        () => uiStore.hideAreYouSureModal(),
                                    );" v-if="isReading"
                                        class="flex w-50 items-center gap-x-1 cursor-pointer text-error py-2 px-3  transition-all hover:pl-4 hover:bg-error/20">
                                        <FontAwesomeIcon :icon="faBookOpen" />
                                        <p>Stop reading</p>
                                    </button>
                                    <button @click="confirmDeleteFinishedBook(closeModal)" v-if="isFinishedBook"
                                        class="flex w-50  items-center gap-x-1 cursor-pointer text-error py-2 px-3  transition-all hover:pl-4 hover:bg-error/20">
                                        <FontAwesomeIcon :icon="faXmark" />
                                        <p>Mark Unfinished</p>
                                    </button>
                                </template>
                            </OptionsCom>
                            <img class="h-[420px] w-full rounded-3xl object-cover shadow-2xl"
                                :src="book?.volumeInfo?.imageLinks?.thumbnail || '/assets/backGrounds/authBackGround.svg'"
                                :alt="book?.volumeInfo?.title || 'Book cover'" />
                        </div>

                        <div class="flex flex-col">
                            <p class="text-sm uppercase tracking-[0.3em] text-white/45">Book details</p>
                            <h1 class="mt-3 text-3xl font-semibold leading-tight sm:text-lg">{{ book.volumeInfo.title
                            }}</h1>

                            <div class="mt-4 flex flex-wrap gap-2">
                                <span v-for="author in book?.volumeInfo?.authors || []" :key="author"
                                    class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-white/75">
                                    <img class="h-6 w-6 rounded-full object-cover" src="/assets/authors/author.webp"
                                        :alt="author" />
                                    {{ author }}
                                </span>
                            </div>

                            <p class="mt-5 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
                                {{ book.volumeInfo.subtitle }}
                            </p>

                            <div class="mt-6 ">
                                <div v-for="fact in quickFacts" :key="fact.label"
                                    class="rounded-lg border mb-2 border-bg-section/10 bg-Shark/30 p-4">
                                    <p class="text-xs uppercase tracking-[0.25em] text-white/45">{{ fact.label }}</p>
                                    <p class="mt-2 text-lg font-semibold">{{ fact.value }}</p>
                                </div>
                            </div>

                            <div class="mt-6 flex flex-wrap gap-3">
                                <button @click="userBooks.addToFinishedBooks(book)" :disabled="isFinishedBook"
                                    :class="[isFinishedBook ? 'cursor-default bg-white text-success' : 'bg-success text-white hover:brightness-110']"
                                    class="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition">
                                    <FontAwesomeIcon :icon="faCheck" />
                                    {{ isFinishedBook ? 'Marked as read' : 'Mark as read' }}
                                </button>

                                <button
                                    @click="userBooks.isFavorite(book?.id) ? userBooks.removeFromFavorites(book?.id) : userBooks.addToFavorites(book)"
                                    :class="[userBooks.isFavorite(book?.id) ? 'bg-white text-error' : 'bg-error text-white hover:brightness-110']"
                                    class="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition">
                                    <FontAwesomeIcon
                                        :icon="userBooks.isFavorite(book?.id) ? faHeartSolid : faHeartRegular" />
                                    {{ userBooks.isFavorite(book?.id) ? 'In favorites' : 'Add to favorites' }}
                                </button>


                                <div class=" relative">
                                    <button @click="showModal = !showModal"
                                        :class="[userBooks.isInShelfGetter(null, book.id) ? 'bg-white text-warning' : 'bg-warning text-white hover:brightness-110']"
                                        class="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition">
                                        <FontAwesomeIcon :icon="faBookmark" />
                                        {{ userBooks.isInShelfGetter(null, book.id) ? 'On shelf' : 'Add to shelf' }}
                                    </button>
                                    <ShowShelves v-if="showModal" :class="`w-full`" :book="book"
                                        @close-shelves-com="showModal = false"
                                        @open-add-new-shelf-com="showAddNewShelfCom = true" />
                                </div>
                            </div>

                            <div class="mt-6 flex flex-wrap gap-2">
                                <span v-for="category in categories" :key="category" :style="getGenreStyle(category)"
                                    class="rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.22em] shadow-sm">
                                    {{ category }}
                                </span>
                            </div>
                        </div>
                    </div>
                </article>

                <aside class="space-y-6 mt-4 lg:sticky lg:top-6 self-start">
                    <div class="rounded-lg border border-bg-section/10 bg-Shark/95 p-6  ">
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <p class="text-xs uppercase tracking-[0.28em] text-white/45">Progress</p>
                                <h2 class="mt-2 text-2xl font-semibold">Update reading progress</h2>
                            </div>
                            <div class="rounded-2xl bg-bg-main px-3 py-2 text-sm font-semibold text-white">
                                {{ isFinishedBook ? pageCount : currentProgress }}/{{ pageCount }}
                            </div>
                        </div>
                        <p class="mt-4 text-sm leading-6 text-white/65">
                            Log where you are in the book and add a thought so your reading history stays meaningful.
                        </p>
                        <BookProgressCom class="mt-5" :pagesCount="book.volumeInfo.pageCount"
                            :currentPage="currentProgress || 0" :bookID="book.id" :isFinished="isFinishedBook"
                            :book="book" :thoughts="thoughts" />
                    </div>

                    <div v-if="userReview?.body == null ? true : false"
                        class="rounded-lg border border-bg-section/10 bg-bg-section/5 p-6  ">
                        <div class="flex items-center gap-2 text-lg font-semibold">
                            <FontAwesomeIcon :icon="faPenToSquare" />
                            <h2>Write a review</h2>
                        </div>
                        <p class="mt-3 text-sm leading-6 text-white/65">
                            Save a personal review so you can remember what worked, what didn’t, and whether this book
                            deserves a reread.
                        </p>
                        <AddReviewCom :book-i-d="book.id" />
                    </div>

                    <article class="rounded-lg h-fit border border-bg-section/10 bg-bg-section/5 p-6  ">
                        <div class="flex items-center gap-2 text-lg font-semibold">
                            <FontAwesomeIcon :icon="faPenToSquare" />
                            <h2>Quick note</h2>
                        </div>
                        <div class="mt-5 rounded-3xl border border-bg-section/10 bg-bg-main/60 p-5">
                            <p class="text-sm uppercase tracking-[0.25em] text-white/45">Latest thought</p>
                            <p class="mt-3 text-sm leading-7 text-white/75 wrap-break-word">
                                {{ currentThought?.thought || `No notes yet. Add a progress update to capture a thought
                                from
                                your reading session. `}}
                            </p>
                            <div class="mt-4 flex items-center justify-between text-sm text-white/55">
                                <span>{{ currentThought?.date || 'No saved date' }}</span>
                                <span>{{ currentProgress }} pages read</span>
                            </div>
                        </div>
                        <div class="mt-5 grid gap-3 sm:grid-cols-2">
                            <div class="rounded-2xl border border-bg-section/10 bg-bg-section/5 p-4">
                                <p class="text-xs uppercase tracking-[0.25em] text-white/45">Status</p>
                                <p class="mt-2 font-medium text-white">{{ readingStateLabel }}</p>
                            </div>
                            <div class="rounded-2xl border border-bg-section/10 bg-bg-section/5 p-4">
                                <p class="text-xs uppercase tracking-[0.25em] text-white/45">Ratings</p>
                                <p class="mt-2 font-medium text-white">{{ ratingCount || 'No data' }}</p>
                            </div>
                        </div>
                    </article>
                </aside>
            </section>

            <section class="w-full">
                <article class="rounded-lg border border-bg-section/10 bg-Shark/95 p-6  ">
                    <div class="flex items-center gap-2 text-lg font-semibold">
                        <FontAwesomeIcon :icon="faBook" />
                        <h2>About this book</h2>
                    </div>

                    <div class="mt-5 space-y-5 text-sm leading-7 text-white/70">
                        <div>
                            <p class="text-xs uppercase tracking-[0.25em] text-white/45">Description</p>
                            <p v-html="book.volumeInfo?.description" class="mt-2"></p>
                        </div>

                        <div>
                            <p class="text-xs uppercase tracking-[0.25em] text-white/45">Subtitle</p>
                            <p class="mt-2">{{ book.volumeInfo.subtitle || "No subtitle provided for this title." }}</p>
                        </div>

                        <div>
                            <p class="text-xs uppercase tracking-[0.25em] text-white/45">Metadata</p>
                            <div class="mt-3 grid gap-3 sm:grid-cols-2">
                                <div class="rounded-2xl border border-bg-section/10 bg-bg-section/5 p-4">
                                    <p class="text-xs text-white/45">Publisher</p>
                                    <p class="mt-1 font-medium text-white">{{ book.volumeInfo.publisher || 'Unknown' }}
                                    </p>
                                </div>
                                <div class="rounded-2xl border border-bg-section/10 bg-bg-section/5 p-4">
                                    <p class="text-xs text-white/45">Published</p>
                                    <p class="mt-1 font-medium text-white">{{ book.volumeInfo.publishedDate || 'Unknown'
                                    }}</p>
                                </div>
                                <div class="rounded-2xl border border-bg-section/10 bg-bg-section/5 p-4">
                                    <p class="text-xs text-white/45">Language</p>
                                    <p class="mt-1 font-medium text-white">{{ book.volumeInfo.language || 'Unknown' }}
                                    </p>
                                </div>
                                <div class="rounded-2xl border border-bg-section/10 bg-bg-section/5 p-4">
                                    <p class="text-xs text-white/45">Ratings</p>
                                    <div class="mt-1 flex items-center gap-2 text-white">
                                        <FontAwesomeIcon class="text-star"
                                            v-for="star in Number.isInteger(book.volumeInfo.averageRating)" :key="star"
                                            :icon="faStar" />
                                        <span class="text-sm text-white/60">{{ ratingCount }} ratings</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>


            </section>

            <section class="rounded-lg border border-bg-section/10 bg-Shark/95 p-6  ">
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p class="text-xs uppercase tracking-[0.28em] text-white/45">Reviews</p>
                        <h3 class="mt-2 text-3xl font-semibold">Readers are talking</h3>
                    </div>
                    <span
                        class="rounded-full border border-bg-section/10 bg-bg-section/5 px-4 py-2 text-sm text-white/65">
                        {{ userReview?.body && ratingCount ? ratingCount + 1 : userReview?.body ? 1 : 0 }} community
                        ratings
                    </span>
                </div>

                <div <div :class="[userReview?.body == null ? 'grid gap-6 xl:grid-cols-[1fr_1.2fr]' : 'block']"
                    class="mt-6">
                    <div class="space-y-4">
                        <div v-if="userReview?.body == null ? true : false"
                            class=" flex justify-center xl:hidden  items-center mx-auto ">
                            <p class="border rounded-lg border-bg-section/10 bg-bg-section/5 p-5 text-sm text-white/65">
                                No
                                community
                                reviews yet. Be
                                the first to add one.</p>
                        </div>
                        <div v-if="userReview"
                            class="rounded-3xl max-w-122 border border-bg-section/10 bg-bg-section/5 p-4">
                            <p class="text-xs  uppercase tracking-[0.25em] text-white/45">Your review</p>
                            <ReviewBoxCom class="mt-4 mx-auto " :obj="{
                                name: `${userAuth.user?.displayName || 'user'}`,
                                profileImg: `https://picsum.photos/200/300?random=1`,
                                rating: userReview.rating,
                                review: userReview.body,
                            }" :reviewID="userReview.id" :isUserReview="true" />
                        </div>

                        <div v-else class="rounded-3xl border border-dashed border-bg-section/15 bg-bg-section/5 p-5">
                            <p class="text-xs uppercase tracking-[0.25em] text-white/45">Your review</p>
                            <p class="mt-3 text-sm leading-7 text-white/65">
                                Share your own opinion after finishing the book. It helps you remember what stood out
                                and gives the page a personal touch.
                            </p>

                        </div>

                        <AddReviewCom v-if="userReview?.body == null ? true : false" :book-i-d="book.id" />
                    </div>
                    <div v-if="userReview?.body == null ? true : false"
                        class=" flex justify-center max-xl:hidden  items-center mx-auto ">
                        <p class="border rounded-lg border-bg-section/10 bg-bg-section/5 p-5 text-sm text-white/65"> No
                            community
                            reviews yet. Be
                            the first to add one.</p>
                    </div>
                </div>
            </section>

            <section v-if="similarBooks.length" class="rounded-lg border border-bg-section/10 bg-Shark/95 p-6  ">
                <div class="flex items-center justify-between gap-4 mb-4">
                    <div>
                        <p class="text-xs uppercase tracking-[0.28em] text-white/45">Discovery</p>
                        <h3 class="mt-2 text-3xl font-semibold">Similar books</h3>
                    </div>
                    <p class="text-sm  text-white/55">Browse titles related to {{ primaryCategory }}</p>
                </div>

                <CarouselCom class="mt-6" :items-per-view="4" :show-arrows="true">
                    <SlideCom v-for="similarBook in similarBooks" :key="similarBook.id">
                        <BookCardCom :book="similarBook" />
                    </SlideCom>
                </CarouselCom>
            </section>
        </div>


        <AddNewShelfCom v-if="showAddNewShelfCom" @close="showAddNewShelfCom = false" />
    </div>
</template>

<style scoped>
.slider {
    scrollbar-width: none;
}
</style>