# REDIvent

### Workshop and Event Management Platform

[Features](#features) • [Installation](#getting-started) • [Usage](#usage-guide) • [Screenshots](#screenshots)

---

## Project Description

> _"Never miss your next opportunity"_

During my time at [ReDI School Munich](https://www.redi-school.org/munich), I found it hard to keep track of all the events and workshops offered. Especially for someone looking for a new job, these events are extremely valuable and help build your network.

This minimalistic web application is designed to rganize and display all upcoming events and workshops in a visually appealing way. Users can search, filter, and register for events, as well as cancel their registration.

---

## Features

- Search events by title
- Filter by category (Tech, Career, Social, Mentorship)
- Register/Unregister for events
- Persistent registration via LocalStorage
- Toast notifications for user feedback
- Responsive design
- Dedicated page for registered events

---

## Technologies Used

| Category            | Technology                                                                 |
| ------------------- | -------------------------------------------------------------------------- |
| **Frontend**        | Vanilla JavaScript (ES6 Modules)                                           |
| **Styling**         | CSS3 with CSS Variables                                                    |
| **Data**            | JSON / [Mockoon API](https://mockoon.com) / Claude AI for event generation |
| **Storage**         | LocalStorage API                                                           |
| **Version Control** | GitHub                                                                     |

---

## AI Assistance

Claude AI assisted with parts of this project, such as debugging code, generating events, and improving CSS styles. For example, it helped to create a harmonious colour scheme.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Web browser (Chrome, Firefox, Safari)
- [VS Code](https://code.visualstudio.com/) with Live Server extension
- [Mockoon](https://mockoon.com) (for API simulation)

### Installation

1. **Clone the repository**

```bash
   git clone https://github.com/yourusername/redivent.git
   cd redivent
```

2. **Configure Mockoon API**

   - Open Mockoon and create a new environment
   - Set the port to `3001`
   - Create a new route:
     - Method: `GET`
     - Route: `/`
   - In the Response body, paste the content from `js/event-input.json`
   - Start the Mockoon server

3. **Start the application**
   - Right-click on `pages/index.html` in VS Code
   - Select "Open with Live Server"
   - The app will open at `http://localhost:5500/pages/index.html`

---

## Usage Guide

### Browsing Events

1. Navigate to the homepage to see all available events
2. Use the search bar to find specific events by title
3. Click filter chips (Tech, Career, Social, Mentorship) to narrow results

### Registering for Events

1. Click the "Register" button on any event card
2. A success notification will appear
3. The event counter will update automatically

### Managing Your Events

1. Navigate to "My Events" in the navigation menu
2. View all events you've registered for
3. Click "Unregister" to cancel your registration
4. See the countdown to your next upcoming event

---

## Author

**Rania Qteishat-Stöver**

ReDI School Munich Student

---

## Acknowledgments

### Special Thanks To

**[ReDI School Munich](https://www.redi-school.org/munich)** for providing this learning opportunity

**The Instructors** for dedicating their personal time to teach us

---
