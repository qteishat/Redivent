import { getSpotsInfo } from "./event-utils.js";

/**
 * Renders a list of events to the DOM
 * Clears existing events and removes any hint messages before rendering
 *
 * @param {Event[]} events - Array of event objects to render
 * @param {function(Event): HTMLElement} createCardCallback - Callback function that creates an event card element
 *
 */
export function renderEvents(events, createCardCallback) {
  const eventsGrid = document.querySelector(".events-grid");
  eventsGrid.innerHTML = "";

  const container = eventsGrid.parentElement;
  const oldHint = container.querySelector(".hint");
  if (oldHint) oldHint.remove();

  events.forEach((event) => {
    const eventCard = createCardCallback(event);
    eventsGrid.appendChild(eventCard);
  });
}

/**
 * Creates a single event card DOM element with all event information
 * Includes event details, registration button, and spots availability
 *
 * @param {function(Event): boolean} isRegisteredCallback - Callback to check if user is registered
 * @param {function(HTMLButtonElement, number): void} onClickCallback - Callback for register button click
 *
 * @returns {HTMLElement} The created event card element
 *
 */
export function createEventCard(event, isRegisteredCallback, onClickCallback) {
  const eventCard = document.createElement("div");
  eventCard.className = "event-card";

  const isRegistered = isRegisteredCallback(event);
  const buttonClass = isRegistered ? "btn-register registered" : "btn-register";
  const buttonText = isRegistered ? "Unregister" : "Register";
  const spotsInfo = getSpotsInfo(event.spotsLeft);

  eventCard.innerHTML = `
    <span class="card-badge badge-${event.category.toLowerCase()}">
      ${event.category}
    </span>
    <div class="card-content">
      <h3 class="card-title">${event.title}</h3>
      <div class="card-meta">
        <p>${event.date}</p>
        <p>${event.time}</p>
        <p>${event.location}</p>
      </div>
      <p class="${spotsInfo.className}">${spotsInfo.text}</p>
      <button class="${buttonClass}" data-event-id="${event.id}">${buttonText}</button>
    </div>
  `;

  const button = eventCard.querySelector(".btn-register");
  button.addEventListener("click", () => onClickCallback(button, event.id));

  return eventCard;
}

/**
 * Updates the visual state of a register button
 * Changes button text and CSS class based on registration status
 *
 * @param {HTMLButtonElement} button - The register button element to update
 * @param {boolean} isRegistered - Whether the user is registered for the event
 *
 */
export function updateButtonState(button, isRegistered) {
  if (isRegistered) {
    button.classList.add("registered");
    button.textContent = "Unregister";
  } else {
    button.classList.remove("registered");
    button.textContent = "Register";
  }
}

/**
 * Updates the spots availability display in an event card
 * Finds the spots element within the card and updates its text and styling
 *
 * @param {HTMLButtonElement} button - Register button (used to find parent card)
 * @param {number} spotsLeft - Number of remaining spots
 *
 */
export function updateSpotsDisplay(button, spotsLeft) {
  const eventCard = button.closest(".event-card");
  const spotsInfo = getSpotsInfo(spotsLeft);
  const spotsElement = eventCard.querySelector(".card-spots");

  spotsElement.textContent = spotsInfo.text;
  spotsElement.className = spotsInfo.className;
}
