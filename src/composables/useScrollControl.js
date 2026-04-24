/**
 * useScrollLock composable
 *
 * This composable is responsible for controlling the ability to scroll the page.
 * It is typically used when UI elements like modals, dropdowns, side panels, or dialogs
 * are open and you want to prevent the background content from scrolling.
 *
 * When "locked":
 * - Mouse wheel scrolling is blocked
 * - Touch scrolling (mobile swipe scroll) is blocked
 * - Keyboard-based scrolling is blocked (Arrow keys, PageUp, PageDown, Home, End)
 *
 * When "unlocked":
 * - All normal scrolling behavior is restored
 * - Event listeners are removed to prevent unnecessary performance impact
 *
 * Internally:
 * - "wheel" and "touchmove" events prevent mouse and touch scrolling
 * - "keydown" event prevents keyboard navigation-based scrolling
 *
 * @returns {Object} Scroll control methods
 * @returns {Function} return.lock - Activates scroll blocking behavior
 * @returns {Function} return.unlock - Restores default page scrolling behavior
 */
export function useScrollLock() {
  const preventScroll = (e) => e.preventDefault();

  const preventKeys = (e) => {
    const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
    if (keys.includes(e.key)) e.preventDefault();
  };

  const lock = () => {
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });
    document.addEventListener("keydown", preventKeys);
  };

  const unlock = () => {
    document.removeEventListener("wheel", preventScroll);
    document.removeEventListener("touchmove", preventScroll);
    document.removeEventListener("keydown", preventKeys);
  };

  return { lock, unlock };
}
