# LaunchPad — Online Startup Incubator Platform

LaunchPad is a comprehensive, production-ready full-stack web application designed to manage an online startup incubator. It provides dedicated portals for four distinct roles: Founders, Mentors, Investors, and Administrators, alongside a set of dynamic public pages to showcase the ecosystem.

## Features

### Public Portal
*   **Landing Page**: A stunning, premium homepage highlighting the incubator's mission.
*   **Programs Directory**: Live showcase of 4 flagship incubator programs (IdeaLab, Core, ScaleUp, Global Accelerator) with equity, funding details, and FAQ.
*   **Startup Portfolio**: A dynamic directory of active startups equipped with real-time search, industry filtering, and performance stats.
*   **Mentor Network**: A grid of industry-leading mentors with expertise tags, ratings, and a recruitment CTA.
*   **Events Calendar**: Real-time event registration (workshops, pitch days, networking) with seat availability tracking and one-click registration.
*   **About Us**: Mission, values, history timeline, and team profiles.

### Authenticated Dashboards
*   **🚀 Startup Founder**: Mission control for startups to track incubation progress across 7 milestones, upload pitch decks, book mentoring sessions, and discover funding opportunities.
*   **🎓 Mentor**: Allows mentors to manage assigned startups, review milestone submissions, provide structured feedback, and track upcoming meetings.
*   **💼 Investor Hub**: Enables investors to discover startups by stage and industry, manage a personalized watchlist, and submit formal investment interests directly to founders.
*   **⚙️ Admin Operations Console**: Provides high-level platform analytics, application review workflows, mentor assignments, and global incubation oversight.

## Technology Stack

*   **Backend:** Node.js with Express
*   **Database:** SQLite (using `sql.js` for zero-configuration portability with an in-memory db that syncs to disk)
*   **Authentication:** JWT-based role authentication via `localStorage`
*   **Frontend:** Pure HTML/CSS/JS featuring a custom-built premium design system (glassmorphism, fluid animations, dark-mode aesthetic) without the overhead of heavy frontend frameworks.

## Getting Started

### Prerequisites

*   Node.js (v14 or higher recommended)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/ARJUN2006-B/launchpad-incubator.git
    cd launchpad-incubator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the server (this will automatically initialize and seed the database if it doesn't exist):
    ```bash
    npm start
    ```

4.  Open your browser and navigate to `http://localhost:3000`.

### Demo Accounts

The database is pre-seeded with demo data. You can log in using the following accounts (Password for all: `Demo@2024`):

*   **Founder:** `startup@launchpad.demo`
*   **Mentor:** `mentor@launchpad.demo`
*   **Investor:** `investor@launchpad.demo`
*   **Admin:** `admin@launchpad.demo`

## Project Structure

*   `/api`: Express route handlers for the REST API endpoints (auth, startups, mentors, events, funding, etc.)
*   `/db`: Database initialization, schema definition, and seeding scripts
*   `/middleware`: Authentication and authorization middleware
*   `/public`: Public-facing dynamic HTML pages, shared CSS, client-side API wrappers (`api.js`)
*   `/dashboards`: Role-specific dashboard HTML files, logic (`app.js`), and specialized sub-views
*   `server.js`: Main Express application entry point, route registration, and static file serving

## License

This project is licensed under the MIT License.
