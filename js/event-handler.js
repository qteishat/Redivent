/**
 * This function fetches all events from a mock API and renders each event dynamically.
 * The fetched events are all AI generated.
 */
function fetchEventsFromApi() {
  fetch("http://localhost:3001")
    .then((response) => response.json())
    .then((data) => {
      const eventsGrid = document.querySelector(".events-grid");
      eventsGrid.innerHTML = ""; // delete old events

      data.forEach((event) => {
        const eventCard = document.createElement("div");
        eventCard.className = "event-card";

        // create each event dynamically
        eventCard.innerHTML = `
          <span class="card-badge badge-${event.category.toLowerCase()}">${
          event.category
        }</span>
          <div class="card-content">
            <h3 class="card-title">${event.title}</h3>
            <div class="card-meta">
              <p>${event.date}</p>
              <p>${event.time}</p>
              <p>${event.location}</p>
            </div>
            <p class="card-spots warning">Only ${
              event.spotsLeft
            } spots left!</p>
            <button class="btn-register">Register Now</button>
          </div>
        `;

        eventsGrid.appendChild(eventCard);
      });
    })
    .catch((error) => console.error("Error:", error));
}

// fetch events from API once DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchEventsFromApi);
