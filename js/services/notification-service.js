/**
 * Service for displaying user notifications and hints
 */
class NotificationService {
  /**
   * Displays a temporary toast notification in the top-right corner
   * Toast automatically disappears after 3 seconds with a fade-out animation
   *
   * @param {string} message - The message to display in the toast
   * @param {"success"|"error"} - Toast type (affects styling)
   */
  showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "fadeOut 0.4s ease-out forwards";
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  /**
   * Displays a persistent hint message in the events grid area
   *
   * @param {string} message - The hint message to display (can contain HTML)
   * @returns {void}
   */
  showHint(message) {
    const eventsGrid = document.querySelector(".events-grid");
    eventsGrid.innerHTML = "";

    const container = eventsGrid.parentElement;
    const oldHint = container.querySelector(".hint");
    if (oldHint) oldHint.remove();

    const hint = document.createElement("div");
    hint.className = "hint";
    hint.innerHTML = `<div><p>${message}</p></div>`;
    container.insertBefore(hint, eventsGrid);
  }
}

export { NotificationService };
