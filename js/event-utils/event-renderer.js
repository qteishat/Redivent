import { getSpotsInfo } from "./event-utils.js";

/**
 * Renders events to the DOM
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
 * Creates a single event card element
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
