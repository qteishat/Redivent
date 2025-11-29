/**
 * Homepage Controller
 * Manages event display, filtering, search functionality, and user registration
 * for the homepage of the REDIvent application
 */

import { fetchEvents } from "../api.js";
import { Storage } from "../services/storage.js";
import { renderEvents, createEventCard } from "../event-utils/event-renderer.js";
import { getUpcomingEvent, getSpotsInfo, filterByTitle, filterByCategory } from "../event-utils/event-utils.js";
import { NotificationService } from "../services/notification-service.js";

// Array containing all events fetched from the API
let eventsArray = [];

//Storage service instance for managing LocalStorage operations
const storage = new Storage();

//Notification service instance for displaying toast messages and hints
const notification = new NotificationService();

/**
 * Initializes the homepage
 * Fetches events from API, renders them to the page, updates statistics,
 * and sets up event listeners for user interactions
 *
 * @async
 * @returns {Promise<void>}
 */
async function init() {
  eventsArray = await fetchEvents();
  renderEventsToPage(eventsArray, "");
  updateStats();
  setupEventListeners();
}

/**
 * Renders events to the page with appropriate callbacks
 * Shows hint message if no events are found
 *
 * @param {Event[]} events - Array of events to display
 * @param {string} userInput - User's search term (used for error messages)
 */
function renderEventsToPage(events, userInput) {
  if (events.length === 0) {
    if (!userInput) {
      notification.showHint("Sorry, we're currently experiencing a problem.");
    } else {
      notification.showHint(
        `No events found matching "${userInput}". Try a different search term or browse all events.`
      );
    }
    return;
  }

  renderEvents(events, (event) => {
    return createEventCard(
      event,
      (e) => storage.isEventRegistered(e),
      (button, eventId) => toggleReservation(button, eventId)
    );
  });
}

/**
 * Updates the statistics displayed in the hero section
 * Shows total events count, user's registration count, and time until next event
 */
function updateStats() {
  document.getElementById("events-count").textContent = eventsArray.length;
  document.getElementById("registration-count").textContent = storage.getMyEvents().length;
  document.getElementById("events-ticker").textContent = getUpcomingEvent(eventsArray)[0];
}

/**
 * Updates the spots availability display in an event card
 *
 * @param {HTMLButtonElement} button - The register button element
 * @param {number} spotsLeft - Number of remaining spots
 */
function updateSpotsLeft(button, spotsLeft) {
  const eventCard = button.closest(".event-card");
  const spotsInfo = getSpotsInfo(spotsLeft);
  const spotsElement = eventCard.querySelector(".card-spots");
  spotsElement.textContent = spotsInfo.text;
  spotsElement.className = spotsInfo.className;
}

/**
 * Toggles event registration status (register or unregister)
 * Determines current registration state and calls appropriate handler
 *
 * @param {HTMLButtonElement} button - The register button that was clicked
 * @param {number} eventId - ID of the event to toggle registration for
 */
function toggleReservation(button, eventId) {
  const clickedEvent = eventsArray.find((event) => event.id == eventId);

  if (!clickedEvent) {
    console.log("Event not found!");
    return;
  }

  if (storage.isEventRegistered(clickedEvent)) {
    handleUnregister(button, clickedEvent);
  } else {
    handleRegister(button, clickedEvent);
  }

  updateStats();
}

/**
 * Handles user registration for an event
 * Checks for available spots, registers user, updates UI and shows notification
 *
 * @param {HTMLButtonElement} button - The register button element
 * @param {Event} event - The event object to register for
 */
function handleRegister(button, event) {
  if (event.spotsLeft <= 0) {
    notification.showToast("Sorry, this event is fully booked!", "error");
    return;
  }

  const registered = storage.setMyEvent(event);
  if (registered) {
    button.classList.add("registered");
    button.textContent = "Unregister";
    event.spotsLeft--;
    updateSpotsLeft(button, event.spotsLeft);

    notification.showToast("You're registered! See you there!", "success");
  } else {
    notification.showToast("Registration failed. Please try again.", "error");
  }
}

/**
 * Handles user unregistration from an event
 * Cancels registration, updates UI and shows notification
 *
 * @param {HTMLButtonElement} button - The unregister button element
 * @param {Event} event - The event object to unregister from
 */
function handleUnregister(button, event) {
  const cancelled = storage.cancelEvent(event);
  if (cancelled) {
    button.classList.remove("registered");
    button.textContent = "Register";
    event.spotsLeft++;
    updateSpotsLeft(button, event.spotsLeft);

    notification.showToast("Unregistered successfully", "success");
  } else {
    notification.showToast("Cancellation failed. Please try again.", "error");
  }
}

/**
 * Handles category filter button clicks
 * Updates active filter state and re-renders events for selected category
 *
 * @param {HTMLButtonElement} button - The filter button that was clicked
 */
function handleCategoryFilter(button) {
  document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
  button.classList.add("active");

  const category = button.id.replace("filter-", "");
  const filtered = filterByCategory(eventsArray, category);
  renderEventsToPage(filtered, "");
}

/**
 * Sets up all event listeners for the page
 * Attaches listeners for search input and filter buttons
 */
function setupEventListeners() {
  const searchInput = document.querySelector("#search-input");
  searchInput.addEventListener("input", () => {
    const filtered = filterByTitle(eventsArray, searchInput.value);
    renderEventsToPage(filtered, searchInput.value);
  });

  const filterButtons = document.querySelectorAll(".filter-chip");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleCategoryFilter(button);
    });
  });
}

//Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", init);
