/**
 * Manages event registrations in localStorage
 */
export class Storage {
  /**
   * Retrieves all registered event IDs from localStorage
   * @returns {number[]} Array of event IDs
   */
  _getEventIdsFromStorage() {
    const stored = localStorage.getItem("myEvents");
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Saves event IDs to localStorage
   * @param {number[]} eventIds - Array of event IDs to save
   */
  _saveEventIdsToStorage(eventIds) {
    localStorage.setItem("myEvents", JSON.stringify(eventIds));
  }

  /**
   * Registers user to an event
   * @param {Object} event - The event object to register
   * @param {number} event.id - The unique event ID
   * @returns {boolean} True if registration successful, false if already registered
   */
  setMyEvent(event) {
    const myEventsById = this._getEventIdsFromStorage();
    if (myEventsById.includes(event.id)) return false;
    myEventsById.push(event.id);
    this._saveEventIdsToStorage(myEventsById);
    return true;
  }

  /**
   * Returns all registered event IDs
   * @returns {number[]} Array of registered event IDs
   */
  getMyEvents() {
    return this._getEventIdsFromStorage();
  }

  /**
   * Checks if user is registered for a specific event
   * @param {Object} event - The event object to check
   * @param {number} event.id - The unique event ID
   * @returns {boolean} True if registered, false otherwise
   */
  isEventRegistered(event) {
    const eventIds = this._getEventIdsFromStorage();
    return eventIds.includes(event.id);
  }

  /**
   * Unregisters user from an event
   * @param {Object} event - The event object to cancel
   * @param {number} event.id - The unique event ID
   * @returns {boolean} True if cancellation successful, false if not registered
   */
  cancelEvent(event) {
    const myEventsById = this._getEventIdsFromStorage();
    const index = myEventsById.indexOf(event.id);
    if (index === -1) return false;
    myEventsById.splice(index, 1);
    this._saveEventIdsToStorage(myEventsById);
    return true;
  }
}
