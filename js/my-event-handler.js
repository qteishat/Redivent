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
}
