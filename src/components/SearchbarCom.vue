<script setup>
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const props = defineProps({ propClass: String });
</script>
<template>
  <div :class="[props.propClass]" class="relative w-180 max-sm:px-2 h-10">
    <input
      type="text"
      class="outline-0 peer block w-full h-full pl-12 bg-text-main rounded-full"
    />

    <FontAwesomeIcon
      class="absolute right-4 peer-focus-visible:text-transparent text-[#333] top-3/6 transform -translate-y-3/6"
      :icon="faMagnifyingGlass"
    />
    <div class="absolute w-full h-40 z-30"></div>
  </div>
</template>
