import { onMounted, onBeforeUnmount } from "vue";
/**
 * useClickOutside composable
 *
 * Detects clicks outside of a target element and triggers a callback.
 * Useful for dropdowns, modals, popovers, menus, etc.
 *
 * @param {import('vue').Ref<HTMLElement | null>} targetRef - The element to watch (Vue ref)
 * @param {Function} callback - Function to run when user clicks outside the target element
 *
 * @returns {void}
 */
export function useClickOutside(targetRef, callback) {
  const handler = (e) => {
    if (!targetRef.value) return;
    console.log(e.target);
    const el = targetRef.value?.$el || targetRef.value;
    console.log(!el.contains(e.target) && e.target.id !== "part");
    if (!el.contains(e.target) && e.target.id !== "part") {
      console.log(e.target);
      console.log("clicked outside");
      callback(e);
    }
  };

  onMounted(() => document.addEventListener("click", handler));
  onBeforeUnmount(() => document.removeEventListener("click", handler));
}
