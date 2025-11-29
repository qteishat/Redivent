/**
 * This file is responsible for homepage specific tasks (filter, search...)
 */
import { fetchEvents } from "../api.js";
import { Storage } from "../services/storage.js";
import { renderEvents, createEventCard } from "../event-utils/event-renderer.js";
import { getUpcomingEvent, getSpotsInfo, filterByTitle, filterByCategory } from "../event-utils/event-utils.js";
import { NotificationService } from "../services/notification-service.js";

let eventsArray = [];
const storage = new Storage();
const notification = new NotificationService();

/**
 * Init homepage
 */
async function init() {
  eventsArray = await fetchEvents();
  renderEventsToPage(eventsArray, "");
  updateStats();
  setupEventListeners();
}

/**
 * Wrapper function to render events with callbacks
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
 * Update statboxes in hero section
 */
function updateStats() {
  document.getElementById("events-count").textContent = eventsArray.length;
  document.getElementById("registration-count").textContent = storage.getMyEvents().length;
  document.getElementById("events-ticker").textContent = getUpcomingEvent(eventsArray)[0];
}

/**
 * Toggles event registration (register/unregister)
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
 * Handle event registration
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
 * Handle event unregistration
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
 * Updates spots left display
 */
function updateSpotsLeft(button, spotsLeft) {
  const eventCard = button.closest(".event-card");
  const spotsInfo = getSpotsInfo(spotsLeft);
  const spotsElement = eventCard.querySelector(".card-spots");
  spotsElement.textContent = spotsInfo.text;
  spotsElement.className = spotsInfo.className;
}

/**
 * Handle category filter click
 */
function handleCategoryFilter(button) {
  document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
  button.classList.add("active");

  const category = button.id.replace("filter-", "");
  const filtered = filterByCategory(eventsArray, category); // ✅ Fix: eventsArray hinzugefügt
  renderEventsToPage(filtered, "");
}

/**
 * Setup all event listeners
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

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);
