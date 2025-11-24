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

  getUpcomingEvent() {
    let myEvents = this.getMyEvents();
    let today = new Date();

    // filter for upcoming events
    let upcomingEvents = myEvents.filter((event) => {
      let eventDate = new Date(event.date);
      return eventDate >= today;
    });

    if (upcomingEvents.length === 0) {
      console.error("No upcoming event!");
      return "No";
    }

    // compare two event dates and return the next event
    upcomingEvents.sort((a, b) => {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);
      return dateA - dateB;
    });

    let upcomingEvent = upcomingEvents[0];
    let upcomingEventDate = new Date(upcomingEvent.date);

    // Check if event is today
    if (upcomingEventDate.toDateString() === today.toDateString()) {
      return "less than 24 hours";
    }

    let dif = upcomingEventDate - today;
    // convert form milliseconds to days
    dif = dif / 1000 / 60 / 60 / 24;
    // ceil, so events tomorrow are not "0 days"
    dif = Math.ceil(dif);

    // Singular/Plural handling
    return dif === 1 ? "1 day" : `${dif} days`;
  }
}
