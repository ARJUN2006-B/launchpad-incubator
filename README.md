# LaunchPad — Online Startup Incubator Platform

LaunchPad is a comprehensive, production-ready full-stack web application designed to manage an online startup incubator. It provides dedicated portals for four distinct roles: Founders, Mentors, Investors, and Administrators.

## Features

*   **🚀 Startup Founder Dashboard**: Mission control for startups to track incubation progress, upload pitch decks, book mentoring sessions, and discover funding opportunities.
*   **🎓 Mentor Dashboard**: Allows mentors to manage assigned startups, review milestone submissions, provide structured feedback, and track upcoming meetings.
*   **💼 Investor Hub**: Enables investors to discover startups by stage and industry, manage a personalized watchlist, and submit formal investment interests.
*   **⚙️ Admin Operations Console**: Provides high-level platform analytics, application review workflows, mentor assignment, and global incubation oversight.

## Technology Stack

*   **Backend:** Node.js with Express
*   **Database:** SQLite (using `sql.js` for zero-configuration portability)
*   **Authentication:** JWT-based role authentication
*   **Frontend:** Pure HTML/CSS/JS featuring a custom-built premium design system (glassmorphism, fluid animations, dark-mode aesthetic) without the overhead of heavy frontend frameworks.

## Getting Started

### Prerequisites

*   Node.js (v14 or higher recommended)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/launchpad-incubator.git
    cd launchpad-incubator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the server:
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

*   `/api`: Express route handlers for the REST API
*   `/db`: Database initialization, schema, and seeding scripts
*   `/middleware`: Authentication and authorization middleware
*   `/public`: Public-facing static assets (landing page, login, register, shared JS/CSS)
*   `/dashboards`: Role-specific dashboard HTML files and specialized scripts
*   `server.js`: Main Express application entry point

## License

This project is licensed under the MIT License.
