/**
 * Determines spots display information based on availability
 * @param {number} spotsLeft - Number of remaining spots
 * @returns {{text: string, className: string}} Spots info object
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
 * Calculates days until the next upcoming event
 * @param {Event[]} events - Array of event objects
 * @returns {[string, string]} Tuple of [timeUntil, eventTitle]
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

/**
 * Filters events by category
 * @param {Event[]} events - Array of events
 * @param {string} category - Category to filter by
 * @returns {Event[]} Filtered events
 */
export function filterByCategory(events, category) {
  if (category === "all") return events;
  return events.filter((event) => event.category.toLowerCase() === category.toLowerCase());
}

/**
 * Filters events by search term in title
 * @param {Event[]} events - Array of events
 * @param {string} searchTerm - Term to search for
 * @returns {Event[]} Filtered events
 */
export function filterByTitle(events, searchTerm) {
  if (!searchTerm) return events;
  const term = searchTerm.toLowerCase();
  return events.filter((event) => event.title.toLowerCase().includes(term));
}
