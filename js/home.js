/**
 * This file is responsible for homepage specific tasks (filter, search...)
 */

import { fetchEvents } from "./api.js";
import { Storage } from "./storage.js";
import { renderEvents, createEventCard, getUpcomingEvent, getSpotsInfo } from "./event-utils.js";

let eventsArray = [];
const storage = new Storage();

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
export function renderEventsToPage(events, userInput) {
  if (events.length === 0) {
    if (!userInput) {
      showHint("Sorry, we're currently experiencing a problem.");
    } else {
      showHint(`No events found matching "${userInput}". Try a different search term or browse all events.`);
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
    console.log("No spots left!");
    return;
  }

  const registered = storage.setMyEvent(event);
  if (registered) {
    button.classList.add("registered");
    button.textContent = "Unregister";
    event.spotsLeft--;
    updateSpotsLeft(button, event.spotsLeft);
    console.log("You are in!");
  } else {
    console.log("Registration failed!");
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
    console.log("You are out!");
  } else {
    console.log("Something failed during your cancellation.");
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
 * Filters events by title
 */
function filterEventsByTitle(events, searchTerm) {
  if (!searchTerm) return events;

  const term = searchTerm.toLowerCase();
  return events.filter((event) => event.title.toLowerCase().includes(term));
}

/**
 * Filters events by category
 */
function filterEventsByCategory(category) {
  if (category === "all") return eventsArray;

  return eventsArray.filter((event) => event.category.toLowerCase() === category.toLowerCase());
}

/**
 * Handle category filter click
 */
function handleCategoryFilter(button) {
  document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
  button.classList.add("active");

  const category = button.id.replace("filter-", "");
  const filtered = filterEventsByCategory(category);
  renderEventsToPage(filtered, "");
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  const searchInput = document.querySelector("#search-input");
  searchInput.addEventListener("input", () => {
    const filtered = filterEventsByTitle(eventsArray, searchInput.value);
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
