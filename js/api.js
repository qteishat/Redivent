/**
 * Fetches all events from the API
 * @returns {Promise<Array>} Array of event objects
 */
export async function fetchEvents() {
  try {
    const response = await fetch("http://localhost:3001");
    if (!response.ok) throw new Error("Failed to fetch events");
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
