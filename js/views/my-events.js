import { fetchEvents } from "../api.js";
import { Storage } from "../services/storage.js";
import { renderEvents, createEventCard } from "../event-utils/event-renderer.js";
import { getUpcomingEvent } from "../event-utils/event-utils.js";
import { NotificationService } from "../services/notification-service.js";

const storage = new Storage();
const notification = new NotificationService();
let myEvents = [];

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

function updateStat(events) {
  let countdown = document.getElementById("countdown");
  let eventTitle = document.getElementById("event-title");

  const [countdownText, titleText] = getUpcomingEvent(events);

  countdown.textContent = countdownText;
  eventTitle.textContent = titleText;
}

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

function handleUnregister(button, eventId) {
  const event = myEvents.find((event) => event.id === eventId);

  const removed = storage.cancelEvent(event);

  if (removed) {
    button.closest(".event-card").remove();
    notification.showToast("Unregistered successfully", "success");
  } else {
    notification.showToast("✗ Cancellation failed. Please try again.", "error");
  }
  init();
}

document.addEventListener("DOMContentLoaded", init);
