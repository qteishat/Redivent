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

/*
 * Updates CSS class and text content based on the number of left spots
 */
export function getSpotsInfo(spotsLeft) {
  if (spotsLeft < 10) {
    return {
      text: `Only ${spotsLeft} spots left!`,
      className: "card-spots warning",
    };
  }
  return {
    text: `${spotsLeft} spots available`,
    className: "card-spots",
  };
}

/**
 * Shows hint message
 */
export function showHint(message) {
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
  if (upcomingEvents.length === 0) {
    return ["Get started", "Register for events on the Home page"];
  }

  // save title for My-Events page
  const title = upcomingEvents[0].title;
  // Get the nearest
  const nextEventDate = new Date(upcomingEvents[0].date);

  // Check if event is today
  if (nextEventDate.toDateString() === today.toDateString()) return ["less than 24 hours", title];

  // Convert differnce from milliseconds to days and calculate days until event
  const diffDays = Math.ceil((nextEventDate - today) / (1000 * 60 * 60 * 24));

  // Singular/ Plural Handling
  let dif = diffDays === 1 ? "1 day" : `${diffDays} days`;
  return [dif, title];
}
