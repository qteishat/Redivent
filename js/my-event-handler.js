export class MyEvents {
  // HELPER: get event ID from LocalStorage
  _getEventIdsFromStorage() {
    const stored = localStorage.getItem("myEvents");
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  }

  // HELPER: save array in LocalStorage
  _saveEventIdsToStorage(eventIds) {
    localStorage.setItem("myEvents", JSON.stringify(eventIds));
  }

  // register to an event -> saves only event id
  setMyEvent(event) {
    let myEventsById = this._getEventIdsFromStorage();

    if (myEventsById.includes(event.id)) {
      return false; // Event already exists
    }

    myEventsById.push(event.id);
    this._saveEventIdsToStorage(myEventsById);
    return true;
  }

  // returns all events
  getMyEvents() {
    return this._getEventIdsFromStorage();
  }

  // checks if an event is already saved in localStorage
  isEventRegistered(event) {
    const eventIds = this._getEventIdsFromStorage();
    return eventIds.includes(event.id);
  }

  // removes an event from localStorage
  cancelEvent(event) {
    let myEventsById = this._getEventIdsFromStorage();
    const index = myEventsById.indexOf(event.id);

    // in case event id is not in localStorage
    if (index === -1) {
      return false;
    }
    myEventsById.splice(index, 1);
    this._saveEventIdsToStorage(myEventsById);
    return true;
  }

  clearAllEvents() {
    localStorage.removeItem("myEvents");
  }

  /**
   * Calculates days until the next upcoming event
   * @param {Array} events - Array of all events
   * @returns {String} - Formatted string like "5 days", "Today", etc.
   */
  getUpcomingEvent(events) {
    const today = new Date();

    // Get upcoming events sorted by date
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
    if (nextEventDate.toDateString() === today.toDateString()) return "Today";

    // Convert differnce from milliseconds to days and calculate days until event
    const diffDays = Math.ceil((nextEventDate - today) / (1000 * 60 * 60 * 24));

    // Singular/ Plural handling
    return diffDays === 1 ? "1 day" : `${diffDays} days`;
  }
}
