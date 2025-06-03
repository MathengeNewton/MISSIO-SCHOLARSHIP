# Missio Scholarship Platform

Welcome to the Missio Scholarship Platform! This is a full-stack web application designed to allow students to apply for scholarships and manage their applications.

## Project Overview

The platform consists of two main parts:

1.  **Frontend**: A Next.js application that provides the user interface for applicants. Users can register, log in, fill out scholarship applications, and view their application status.
2.  **Backend**: A Next.js API that handles business logic, user authentication, session management, and database interactions for scholarship applications.

## Project Structure

The project is organized into two main directories:

*   `./frontend/`: Contains all the code for the user-facing Next.js application.
    *   For detailed information on the frontend setup, architecture, and how to run it, please see the [frontend README](./frontend/README.md).
*   `./backend/`: Contains all the code for the Next.js API, database logic, and authentication services.
    *   For detailed information on the backend setup, API endpoints, and how to run it, please see the [backend README](./backend/README.md).

## What The Application Does

*   **User Authentication**: Allows users to create an account, log in, and log out securely. Sessions are persisted.
*   **Scholarship Application**: Provides a form for users to submit their scholarship applications with necessary details and (placeholder) document uploads.
*   **Dashboard**: Authenticated users can view their dashboard to check the status of their submitted scholarship application.
*   **Navigation**: Easy navigation between key pages, including a "Home" button on internal pages.

## What a Developer Needs

To run this project locally, you will need:

*   **Node.js** (version 18.x or later recommended) and **npm** (Node Package Manager).
*   Git for cloning the repository.
*   Two separate terminal windows or tabs to run the frontend and backend servers concurrently.

## Getting Started

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository_url>
    cd missio-scholarship # Or your project's root directory name
    ```

2.  **Set up and run the Backend:**
    *   Navigate to the backend directory: `cd backend`
    *   Install dependencies: `npm install`
    *   Create a `.env.local` file and configure your `JWT_SECRET`. (See [backend README](./backend/README.md) for details).
    *   Start the backend server: `npm run dev` (usually on `http://localhost:3001`).

3.  **Set up and run the Frontend:**
    *   Navigate to the frontend directory (from the root): `cd ../frontend` or `cd frontend` if you are in the root.
    *   Install dependencies: `npm install`
    *   Create a `.env.local` file and configure `NEXT_PUBLIC_BACKEND_URL` to point to your running backend API (e.g., `http://localhost:3001/api`). (See [frontend README](./frontend/README.md) for details).
    *   Start the frontend server: `npm run dev` (usually on `http://localhost:3000`).

4.  **Access the Application:**
    Open your web browser and go to `http://localhost:3000` (or the port your frontend server is running on).

## Contribution

Feel free to contribute to the project. Please follow standard coding practices and ensure your changes are well-tested.
