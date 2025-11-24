// Manages event registrations in localStorage
export class Storage {
  // HELPER: get event IDs from LocalStorage
  _getEventIdsFromStorage() {
    const stored = localStorage.getItem("myEvents");
    return stored ? JSON.parse(stored) : [];
  }

  // HELPER: save array in LocalStorage
  _saveEventIdsToStorage(eventIds) {
    localStorage.setItem("myEvents", JSON.stringify(eventIds));
  }

  // Register to an event -> saves only event id
  setMyEvent(event) {
    const myEventsById = this._getEventIdsFromStorage();
    if (myEventsById.includes(event.id)) return false;

    myEventsById.push(event.id);
    this._saveEventIdsToStorage(myEventsById);
    return true;
  }

  // Returns all registered event IDs
  getMyEvents() {
    return this._getEventIdsFromStorage();
  }

  // Checks if an event is already registered
  isEventRegistered(event) {
    const eventIds = this._getEventIdsFromStorage();
    return eventIds.includes(event.id);
  }

  // Removes an event from localStorage
  cancelEvent(event) {
    const myEventsById = this._getEventIdsFromStorage();
    const index = myEventsById.indexOf(event.id);

    if (index === -1) return false;

    myEventsById.splice(index, 1);
    this._saveEventIdsToStorage(myEventsById);
    return true;
  }

  clearAllEvents() {
    localStorage.removeItem("myEvents");
  }
}
