/**
 * useScrollLock composable
 *
 * This composable is responsible for controlling the ability to scroll the page. if you want to prevent the background content from scrolling.
 
* Controls page scrolling by adding or removing a global "modal-open" class on the document body.
 * @returns {Object} Scroll lock controls
 * @returns {Function} returns.lock Disables page scrolling
 * @returns {Function} returns.unlock Restores page scrolling
 */
let lockCount = 0;

export function useScrollLock() {
  const lock = () => {
    lockCount++;
    if (lockCount === 1) {
      document.body.classList.add("modal-open");
    }
  };
  const unlock = () => {
    lockCount--;
    if (lockCount <= 0) {
      lockCount = 0;
      document.body.classList.remove("modal-open");
    }
  };
  return { lock, unlock };
}
