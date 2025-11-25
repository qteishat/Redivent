import { fetchEvents } from "./api.js";
import { Storage } from "./storage.js";
import { renderEvents, createEventCard, showHint, getUpcomingEvent } from "./event-utils.js";

const storage = new Storage();
let myEvents = [];

async function init() {
  const registeredIds = storage.getMyEvents();
  const allEvents = await fetchEvents();

  myEvents = allEvents.filter((event) => registeredIds.includes(event.id));
  if (myEvents.length === 0) {
    showHint("You did not register to any events");
  }

  renderMyEventsToPage(myEvents);
  document.getElementById("countdown").textContent = getUpcomingEvent(myEvents);
}

function renderMyEventsToPage(events) {
  if (events.length === 0) {
    showHint("You did not register to any events yet.");
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

function handleUnregister(button, eventId) {
  const event = myEvents.find((event) => event.id === eventId);

  const removed = storage.cancelEvent(event);

  if (removed) button.closest(".event-card").remove();
  else {
    console.log("Sorry, we could not unregister you from this event");
  }
  init();
}

document.addEventListener("DOMContentLoaded", init);
