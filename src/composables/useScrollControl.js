/**
 * useScrollLock composable
 *
 * Provides functions to lock and unlock page scrolling.
 * Useful for modals, drawers, dropdowns, etc.
 *
 * It prevents:
 * - Mouse wheel / trackpad scrolling
 * - Touch scrolling on mobile
 * - Keyboard scrolling (Arrow keys, PageUp/Down, Home/End)
 *
 * @returns {Object} An object containing scroll control functions
 * @returns {Function} return.lock - Activates scroll blocking
 * @returns {Function} return.unlock - Restores normal scrolling
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
