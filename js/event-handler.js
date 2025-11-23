import { MyEvents } from "./my-event-handler.js";

let eventsArray = [];
const myEventsHandler = new MyEvents();

/**
 * Fetches all events from the mock API.
 * The fetched events are AI generated.
 */
function fetchEventsFromApi() {
  fetch("http://localhost:3001")
    .then((response) => response.json())
    .then((data) => {
      eventsArray = data;
      renderEvents(eventsArray, ""); // no user input, when loading events the first time
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
    });
}

/**
 * Renders events to the DOM
 * @param {Array} eventsArray - Array of event objects to render
 * @param {String} userInput - title of an event, a user searched for
 */
function renderEvents(eventsArray, userInput) {
  const eventsGrid = document.querySelector(".events-grid");
  eventsGrid.innerHTML = ""; // Clear old events

  const container = eventsGrid.parentElement;

  const oldHint = container.querySelector(".hint");
  if (oldHint) {
    oldHint.remove(); // clear old hints
  }

  const hint = document.createElement("div");
  hint.className = "hint";

  // Show message if no events fetched
  if (eventsArray.length === 0 && !userInput) {
    hint.innerHTML = `
      <div> 
        <p>Sorry, we're currently experiencing a problem.</p>
      </div>`;
    container.insertBefore(hint, eventsGrid);
    return;
  }

  // Show message if no events found matching user input
  if (eventsArray.length === 0 && userInput) {
    hint.innerHTML = `
      <div>
        <p>No events found matching "${userInput}".</p>
        <p>Try a different search term or browse all events.</p>
      </div>
    `;
    container.insertBefore(hint, eventsGrid);
    return;
  }

  // Render each event
  eventsArray.forEach((event) => {
    const eventCard = createEventCard(event);
    eventsGrid.appendChild(eventCard);
  });
}

/**
 * Creates a single event card element
 * @param {Object} event - Event object with title, date, time, etc.
 * @returns {HTMLElement} The created event card
 */
function createEventCard(event) {
  const eventCard = document.createElement("div");
  eventCard.className = "event-card";

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
      <button class="btn-register" data-event-id="${event.id}">Register</button>
    </div>
  `;

  // add event listener
  const button = eventCard.querySelector(".btn-register");
  button.addEventListener("click", () => {
    registerToEvent(button, event.id);
  });

  return eventCard;
}

/**
 * Filters and renders events by title based on user input
 * @param {Array} eventsArray - Array of all events
 * @param {String} userInput - title of an event, a user searched for
 */
function renderEventsByTitle(eventsArray, userInput) {
  // If search is empty, show all events
  if (!userInput) {
    renderEvents(eventsArray, "");
    return;
  }

  const input = userInput.toLowerCase();
  const hits = [];

  eventsArray.forEach((event) => {
    const title = event.title.toLowerCase();
    if (title.includes(input)) {
      hits.push(event);
    }
  });

  renderEvents(hits, userInput);
}

function filterByCategory(category) {
  const allChips = document.querySelectorAll(".filter-chip");
  allChips.forEach((chip) => chip.classList.remove("active"));

  const activeChip = document.getElementById(`filter-${category}`);
  activeChip.classList.add("active");

  if (category === "all") {
    renderEvents(eventsArray, "");
    return;
  }

  const hits = eventsArray.filter((event) => event.category.toLowerCase() === category.toLowerCase());

  renderEvents(hits, "");
}

function registerToEvent(button, eventId) {
  let clickedEvent = eventsArray.find((event) => event.id == eventId);

  // Checks negative cases first
  if (!clickedEvent) {
    return console.log("Event not found!");
  }

  if (myEventsHandler.isEventRegistered(clickedEvent)) {
    return console.log("Already registered!");
  }

  if (clickedEvent.spotsLeft <= 0) {
    return console.log("No spots left!");
  }

  // Happy Path
  let registered = myEventsHandler.setMyEvent(clickedEvent);
  if (registered) {
    button.classList.add("registered");
    console.log("You are in!");
  } else {
    console.log("Registration failed!");
  }
}

// Fetch events when DOM is ready
document.addEventListener("DOMContentLoaded", fetchEventsFromApi);

// Search functionality
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", () => {
  const userInput = searchInput.value;
  renderEventsByTitle(eventsArray, userInput);
});
