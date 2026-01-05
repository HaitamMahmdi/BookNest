<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useUserBooks } from "../../stores/userBooks";
import {
  faShareFromSquare,
  faHeart as faHeartRegular,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const props = defineProps({
  bookInfo: Object,
  isFav: Boolean,
  isInShelf: Boolean,
});
const show = ref(true);

const userBooks = useUserBooks();
const userShelfs = userBooks.shelfs;
const bookCard = ref(null);
const shelfs = ref(null);
const showShelfs = ref(false);
const addShelf = ref(null);
const handleClick = (event) => {
  if (bookCard.value) {
    if (!showShelfs.value) {
      document.addEventListener("click", handleClick);
      showShelfs.value = true;
      bookCard.value.style.overflow = "hidden";
      return;
    }
    if (
      showShelfs.value &&
      !shelfs.value?.contains(event.target) &&
      !addShelf.value.contains(event.target)
    ) {
      showShelfs.value = false;
      console.log(shelfs.value?.contains(event.target));
      bookCard.value.style.overflow = "";
      document.body.style.overflow = "";
      document.removeEventListener("click", handleClick);
      showAddNewShelf.value = false;
    }
  }
};
const showAddNewShelf = ref(false);
const newShelfName = ref("");
const addNewShelf = () => {
  if (newShelfName.value) {
    userBooks.addNewShelf(newShelfName.value.replace(/\s/g, "_"));
    newShelfName.value = "";
    showAddNewShelf.value = false;
  }
};
onMounted(() => {
  document.body.style.overflow = "hidden";
});
onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
<template>
  <div
    v-if="show"
    style="scrollbar-width: none"
    @click.self="$emit('close')"
    class="fixed bg-shdowOverlay w-full h-screen left-0 top-0 md:items-end"
  >
    <div
      ref="bookCard"
      v-if="props.bookInfo"
      :id="props.bookInfo.id"
      style="scrollbar-width: none"
      class="bg-bg-white bottom-0 flex max-h-4/5 max-sm:flex-wrap overflow-scroll max-sm:justify-center max-sm:text-center p-4 rounded-t-2xl pt-8 max-sm:px-0 absolute w-full"
    >
      <div
        class="min-w-40 sm:border-r border-[#ddd] pr-4 max-sm:px-0 flex flex-col"
      >
        <div>
          <img
            draggable="false"
            class="w-40 h-64 mb-4 mx-auto"
            :src="props.bookInfo.volumeInfo.imageLinks?.thumbnail"
            :alt="props.bookInfo.volumeInfo.title"
          />
        </div>
        <div class="mb-3">
          <button
            class="text-2xl cursor-pointer font-semibold text-text-main bg-bg-tertiary px-4 py-2 rounded-md"
          >
            Start Reading
          </button>
        </div>
        <div class="flex flex-wrap items-center justify-between">
          <button
            @click="
              props.isFav
                ? userBooks.removeFromFavorites(props.bookInfo.id)
                : userBooks.addToFavorites(props.bookInfo)
            "
            :title="props.isFav ? 'remove from favorites' : 'add to favorites'"
            class="hover:border-[#DDDD] cursor-pointer border border-transparent p-1 flex items-center justify-center"
          >
            <font-awesome-icon
              :icon="faHeartSolid"
              v-if="props.isFav"
              class="text-2xl text-error!"
            />
            <font-awesome-icon :icon="faHeartRegular" v-else class="text-2xl" />
          </button>
          <button
            title="add to shelf"
            ref="shelfs"
            @click="handleClick($event)"
            class="hover:border-[#DDDD] [425px]:relative cursor-pointer border border-transparent p-1 flex items-center justify-center"
          >
            <img class="w-7" src="/assets/icons/shelf.svg" alt="add to shelf" />
            <div
              style="scrollbar-width: none"
              v-if="showShelfs"
              class="fixed overscroll-contain w-full h-72 shadow-md b rounded-t-4xl overflow-scroll bottom-0 px-4 py-6 z-30 bg-bg-white left-0"
            >
              <ul>
                <li>
                  <button
                    @click="showAddNewShelf = !showAddNewShelf"
                    class="bg-bg-white cursor-pointer group flex items-center border-b border-bg-secondary mb-1 gap-x-4 w-full px-8 py-2.5"
                  >
                    <FontAwesomeIcon :icon="faPenToSquare" />
                    <p class="font-semibold cursor-pointer w-full text-left">
                      Add New Shelf
                    </p>
                  </button>
                </li>
                <li
                  class="bg-bg-white cursor-pointer group flex gap-x-4 w-full px-8 py-2.5"
                >
                  <input
                    type="checkbox"
                    name="shelf"
                    id="shelf"
                    class="cursor-pointer"
                  />
                  <label
                    for="shelf"
                    class="font-semibold cursor-pointer w-full text-left"
                    >shelf</label
                  >
                </li>
                <li
                  @click="
                    () => {
                      shelf.books.some((book) => book.id === props.bookInfo.id)
                        ? userBooks.removeBookFromShelf(
                            shelf.id,
                            props.bookInfo.id
                          )
                        : userBooks.addBookToShelf(shelf.id, bookInfo);
                    }
                  "
                  v-for="(shelf, index) in userShelfs"
                  :key="index"
                  class="bg-bg-white cursor-pointer group flex gap-x-4 w-full px-8 py-2.5"
                >
                  <input
                    type="checkbox"
                    :checked="
                      shelf.books.some((book) => book.id === props.bookInfo.id)
                    "
                    :name="shelf.name"
                    :id="shelf.name"
                    class="cursor-pointer"
                  />
                  <label
                    :for="shelf.name"
                    class="font-semibold cursor-pointer w-full text-left"
                    >{{ shelf.name }}</label
                  >
                </li>
              </ul>
            </div>
          </button>
          <button
            title="share book"
            class="hover:border-[#DDDD] cursor-pointer border border-transparent p-1 flex items-center justify-center"
          >
            <FontAwesomeIcon class="text-2xl" :icon="faShareFromSquare" />
          </button>
        </div>
      </div>
      <ul class="ml-4 max-sm:mt-4 max-sm:ml-0">
        <li>
          <h2 class="font-bold text-textLg">Title :</h2>
          <h2 class="font-semibold text-lg ml-2">
            {{ props.bookInfo.volumeInfo.title }}
          </h2>
        </li>

        <li class="mt-5">
          <p class="font-bold text-textLg">SubTitle :</p>
          <p class="max-w-3xl ml-2 max-sm:ml-0">
            {{
              props.bookInfo.volumeInfo.subtitle ||
              " Lorem ipsum dolor sit amet consectetur adipisicing elre vel error inventore nobis,  totam aspernatur expedita, magnam nihils."
            }}
          </p>
        </li>

        <li class="mt-5">
          <p class="font-bold text-textLg">description :</p>
          <p class="max-w-3xl ml-2 max-sm:ml-0">
            {{
              props.bookInfo.volumeInfo?.description ||
              " Lorem ipsum dolor sit amet consectetur adipisicing elre vel error inventore nobis,  totam aspernatur expedita, magnam nihil facilis minus natus vero asperiores."
            }}
          </p>
        </li>
        <li>
          <h3 class="font-bold mt-4 text-textLg">authors :</h3>
          <div
            class="flex max-sm:w-fit max-sm:mx-auto max-sm:mt-4 items-center mb-2 ml-2"
            v-for="(author, index) in props.bookInfo.volumeInfo.authors"
            :key="author"
          >
            <img
              class="w-7 h-7 rounded-full mr-1"
              :src="`/assets/authors/author${index ? index : ''}.webp`"
              :alt="author"
            />
            <p class="text-[14px]">{{ author }}</p>
          </div>
        </li>
        <li>
          <p class="font-bold text-textLg mt-4">
            Categories :
            <span class="ml-2 font-normal text-[1rem]">{{
              Array.isArray(props.bookInfo.volumeInfo?.categories)
                ? props.bookInfo.volumeInfo?.categories.reduce(
                    (e, a) => e + " " + a
                  )
                : "Unknown"
            }}</span>
          </p>
        </li>
        <li
          class="mt-5 flex items-center max-sm:w-fit max-sm:mx-auto max-sm:mt-4"
        >
          <FontAwesomeIcon
            class="text-star"
            v-for="star in Number.isInteger(
              props.bookInfo.volumeInfo.averageRating
            )
              ? props.bookInfo.volumeInfo.averageRating
              : 3 || 2"
            :key="star"
            :icon="faStar"
          />
          <p class="ml-2">
            Rated by
            <span class="font-bold"
              >{{ props.bookInfo.volumeInfo.ratingsCount || 2 }} users</span
            >
          </p>
        </li>

        <li class="flex flex-wrap gap-y-2 mt-4 max-sm:justify-center">
          <p class="mr-2">
            <span class="font-bold">pageCount : </span>
            {{ props.bookInfo.volumeInfo.pageCount }}
          </p>
          ||
          <p class="mx-2">
            <span class="font-bold">publisher : </span
            >{{ props.bookInfo.volumeInfo.publisher || "Unknown" }}
          </p>
          ||
          <p class="mx-2">
            <span class="font-bold">publishe Date : </span
            >{{ props.bookInfo.volumeInfo.publishedDate || "Unknown" }}
          </p>
          ||
          <p class="ml-2">
            <span class="font-bold">language : </span
            >{{ props.bookInfo.volumeInfo.language }}
          </p>
        </li>
      </ul>
    </div>
    <div
      class="w-full h-full absolute flex justify-center items-center left-0 bg-shdowOverlay top-0 z-60"
      v-show="showAddNewShelf"
    >
      <div
        ref="addShelf"
        class="bg-bg-white w-full md:w-lg top-3/6 left-0 p-4 rounded-md shadow-md"
      >
        <p class="mb-4">New shelf</p>
        <input
          v-model="newShelfName"
          type="text"
          class="block w-full border border-bg-secondary p-2 rounded-md"
          placeholder="New shelf name..."
        />
        <button
          @click="addNewShelf"
          class="px-4 py-1 border w-full border-bg-main rounded-md mt-4 bg-bg-secondary text-bg-white"
        >
          save
        </button>
      </div>
    </div>
  </div>
</template>
