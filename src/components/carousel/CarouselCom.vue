<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { onMounted, ref } from 'vue';
const props = defineProps({
    itemsPerView: {
        type: Number, default: 3
    },
    showArrows: {
        type: Boolean, default: true
    },
    class: {
        type: String, default: ''
    }
})
const track = ref(null);
const prevBtn = ref(null)
const nextBtn = ref(null);
function initSlider(containerId) {

    const scrollAmount = () => track.value.clientWidth * 0.8; // Move by 80% of view

    nextBtn.value.addEventListener('click', () => {
        track.value.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    prevBtn.value.addEventListener('click', () => {
        track.value.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
}

onMounted(() => {
    initSlider();
})
</script>
<template>
    <div class="relative">
        <div ref="track"
            :class="`basis-[calc((100%/${props.itemsPerView})-16px)] gap-4 1xl:basis-[calc((100%/${5})-16px)] max-md:basis-[calc((100%/${3})-16px)] max-sm:basis-[calc(100%/${1})]`"
            class="slider-track  w-full flex  overflow-x-auto snap">

            <slot></slot>

        </div>
        <button ref="nextBtn" v-if="props.showArrows"
            class="absolute right-2 w-10 aspect-square cursor-pointer hover:scale-105  transition top-1/2 transform -translate-y-1/2 bg-bg-main text-white p-2 rounded-full shadow-lg">
            <FontAwesomeIcon :icon="faChevronRight" />
        </button>
        <button ref="prevBtn" v-if="props.showArrows"
            class="absolute  left-2 w-10 aspect-square cursor-pointer hover:scale-105  transition top-1/2 transform -translate-y-1/2 bg-bg-main text-white p-2 rounded-full shadow-lg">
            <FontAwesomeIcon :icon="faChevronLeft" />
        </button>

    </div>
</template>
<style scoped>
.slider-track {
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
}
</style>