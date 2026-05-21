import { onMounted, onBeforeUnmount } from "vue";

/**
 * useClickOutside composable
 *
 * This composable listens for click events on the entire document
 * and detects whether the click happened outside of a specified element.

 * @param {import('vue').Ref<HTMLElement | null>} targetRef
 * The Vue ref pointing to the element/component to detect outside clicks for
 *
 * @param {Function} callback
 * Function executed when a click outside the target element is detected
 *
 * @returns {void}
 */
export function useClickOutside(targetRef, callback) {
  let count = 0;
  const handler = (e) => {
    const el = targetRef.value?.$el || targetRef.value;

    if (!el) return;

    const clickedInside = el.contains(e.target);
    if (!clickedInside && count >= 1) {
      callback(e);
    } else if (!clickedInside && count <= 1) {
      count = 1;
    }
  };

  onMounted(() => {
    document.addEventListener("click", handler);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handler);
  });
}
