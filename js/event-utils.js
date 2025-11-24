/**
 * Renders events to the DOM
 */
export function renderEvents(events, userInput, createCardCallback) {
  const eventsGrid = document.querySelector(".events-grid");
  eventsGrid.innerHTML = "";

  const container = eventsGrid.parentElement;
  const oldHint = container.querySelector(".hint");
  if (oldHint) oldHint.remove();

  if (events.length === 0 && !userInput) {
    showHint(container, eventsGrid, "Sorry, we're currently experiencing a problem.");
    return;
  }

  if (events.length === 0 && userInput) {
    showHint(
      container,
      eventsGrid,
      `No events found matching "${userInput}". Try a different search term or browse all events.`
    );
    return;
  }

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
      <p class="card-spots warning">Only ${event.spotsLeft} spots left!</p>
      <button class="${buttonClass}" data-event-id="${event.id}">${buttonText}</button>
    </div>
  `;

  const button = eventCard.querySelector(".btn-register");
  button.addEventListener("click", () => onClickCallback(button, event.id));

  return eventCard;
}

/**
 * Shows hint message
 */
function showHint(container, eventsGrid, message) {
  const hint = document.createElement("div");
  hint.className = "hint";
  hint.innerHTML = `<div><p>${message}</p></div>`;
  container.insertBefore(hint, eventsGrid);
}

/**
 * Calculates days until the next upcoming event
 */
export function getUpcomingEvent(events) {
  const today = new Date();

  const upcomingEvents = events
    // filter for future events
    .filter((event) => new Date(event.date) >= today)
    // sort dates in ascending order (nearest event first)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // No upcoming events found
  if (upcomingEvents.length === 0) return "Stay tuned";

  // Get the nearest event
  const nextEventDate = new Date(upcomingEvents[0].date);

  // Check if event is today
  if (nextEventDate.toDateString() === today.toDateString()) return "less then 24 hours";

  // Convert differnce from milliseconds to days and calculate days until event
  const diffDays = Math.ceil((nextEventDate - today) / (1000 * 60 * 60 * 24));

  // Singular/ Plural Handling
  return diffDays === 1 ? "1 day" : `${diffDays} days`;
}
