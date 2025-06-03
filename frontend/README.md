# Missio Scholarship Frontend

This is the frontend application for the Missio Scholarship platform. It provides the user interface for applicants to register, log in, manage their profile, submit scholarship applications, and view their application status.

## Tech Stack

*   **Next.js**: React framework for server-side rendering, static site generation, and routing (using App Router).
*   **React**: JavaScript library for building user interfaces.
*   **React Context API**: For global state management, particularly for authentication (`AuthContext`).
*   **Axios**: Promise-based HTTP client for making API requests to the backend.
*   **Tailwind CSS** (or standard CSS/inline styles as currently used): For styling components.

## Features

*   User registration and login.
*   Persistent user sessions using HTTP-only cookies managed by the backend.
*   Dashboard page displaying user information and scholarship application status.
*   Scholarship application form with various input fields.
*   Protected routes accessible only to authenticated users.
*   "Go to Home" navigation buttons on key pages for improved user experience.
*   Client-side validation and feedback for form submissions.

## Setup and Running

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the `frontend` directory. Add the URL for the backend API:
    ```
    NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api
    ```
    Replace `http://localhost:3001/api` with the actual URL if your backend runs on a different port or host. The `/api` suffix is important if your backend API routes are structured that way (e.g., `http://localhost:3001/api/auth/login`).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend application will typically be available at `http://localhost:3000`.

## Prerequisites

*   The [Missio Scholarship Backend](../backend/README.md) server must be running and accessible at the URL specified in `NEXT_PUBLIC_BACKEND_URL`.

## Key Project Structure

*   `app/`: Contains all the pages and layouts (using Next.js App Router).
    *   `layout.js`: Root layout for the application.
    *   `page.js`: Homepage.
    *   `login/page.js`: Login page.
    *   `register/page.js`: Registration page.
    *   `dashboard/page.js`: User dashboard.
    *   `scholarship-application/page.js`: Scholarship application form.
*   `context/`: Contains React Context providers.
    *   `AuthContext.js`: Manages authentication state, user details, and provides login/logout functions.
*   `components/`: (Optional, for shared UI components if created).
*   `public/`: Static assets.
*   `.env.local`: Local environment variables (gitignored).

## Learn More (Next.js)

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
