/**
 * My Events Page Controller
 * Manages the display and unregistration of user's registered events
 * Shows countdown to next upcoming event
 */

import { fetchEvents } from "../api.js";
import { Storage } from "../services/storage.js";
import { renderEvents, createEventCard } from "../event-utils/event-renderer.js";
import { getUpcomingEvent } from "../event-utils/event-utils.js";
import { NotificationService } from "../services/notification-service.js";

//Storage service instance for managing LocalStorage operations
const storage = new Storage();

//Notification service instance for displaying toast messages and hints
const notification = new NotificationService();

//Array of events the user has registered for
let myEvents = [];

/**
 * Initializes the My Events page
 * Fetches all events, filters for user's registered events,
 * and renders them to the page
 *
 * @async
 * @returns {Promise<void>}
 */
async function init() {
  const registeredIds = storage.getMyEvents();
  const allEvents = await fetchEvents();

  myEvents = allEvents.filter((event) => registeredIds.includes(event.id));
  if (myEvents.length === 0) {
    notification.showHint("You did not register to any events");
  }

  renderMyEventsToPage(myEvents);
  updateStat(myEvents);
}

/**
 * Updates the statistics display showing countdown to next event
 * Displays time until next event and event title in the hero section
 *
 * @param {Event[]} events - Array of user's registered events
 */
function updateStat(events) {
  const countdown = document.getElementById("countdown");
  const eventTitle = document.getElementById("event-title");

  if (!countdown || !eventTitle) {
    console.error("Required DOM elements not found");
    return;
  }

  const [countdownText, titleText] = getUpcomingEvent(events);

  countdown.textContent = countdownText;
  eventTitle.textContent = titleText;
}

/**
 * Renders user's registered events to the page
 * Shows hint message if user has no registered events
 * All events are displayed with unregister functionality
 *
 * @param {Event[]} events - Array of user's registered events to display
 */
function renderMyEventsToPage(events) {
  if (events.length === 0) {
    notification.showHint("You did not register to any events yet.");
    return;
  }
  renderEvents(events, (event) => {
    return createEventCard(
      event,
      () => true,
      (button, eventId) => handleUnregister(button, eventId)
    );
  });
}

/**
 * Handles unregistration from an event
 * Removes event from storage, removes card from DOM, and updates statistics
 *
 * @param {HTMLButtonElement} button - The unregister button that was clicked
 * @param {number} eventId - ID of the event to unregister from
 */
function handleUnregister(button, eventId) {
  const event = myEvents.find((event) => event.id === eventId);
  const removed = storage.cancelEvent(event);

  if (removed) {
    // Remove from local array
    myEvents = myEvents.filter((e) => e.id !== eventId);

    // Remove card from DOM with animation
    const eventCard = button.closest(".event-card");
    eventCard.style.animation = "fadeOut 0.3s ease-out forwards";

    setTimeout(() => {
      eventCard.remove();

      // Update statistics
      updateStat(myEvents);

      // Show hint if no events left
      if (myEvents.length === 0) {
        notification.showHint("You did not register to any events yet.");
      }
    }, 300);

    notification.showToast("Unregistered successfully", "success");
  } else {
    notification.showToast("Cancellation failed. Please try again.", "error");
  }
}

// Initialize the My Events page when DOM is ready
document.addEventListener("DOMContentLoaded", init);
