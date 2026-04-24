import { onMounted, onBeforeUnmount } from "vue";

/**
 * useClickOutside composable
 *
 * This composable listens for click events on the entire document
 * and detects whether the click happened outside of a specified element.
 *
 * It is commonly used for UI components that should close when the user
 * clicks outside of them, such as:
 * - Dropdown menus
 * - Modals / dialogs
 * - Popovers
 * - Side panels
 *
 * How it works:
 * - A click listener is attached to the document when the component is mounted
 * - Every click is checked against the target element
 * - If the click is NOT inside the target element, the callback is triggered
 *
 * Notes:
 * - The target can be either a DOM element or a Vue component instance
 *   (handled via `$el` fallback)
 * - Clicks on elements with id="part" are ignored (custom exception for UI behavior)
 * - The listener is automatically cleaned up when the component is unmounted
 *
 * @param {import('vue').Ref<HTMLElement | null>} targetRef
 * The Vue ref pointing to the element/component to detect outside clicks for
 *
 * @param {Function} callback
 * Function executed when a click outside the target element is detected
 *
 * @returns {void}
 */
export function useClickOutside(targetRef, callback) {
  const handler = (e) => {
    if (!targetRef.value) return;
    const el = targetRef.value?.$el || targetRef.value;
    if (!el.contains(e.target) && e.target.id !== "part") {
      callback(e);
    }
  };

  onMounted(() => document.addEventListener("click", handler));
  onBeforeUnmount(() => document.removeEventListener("click", handler));
}
