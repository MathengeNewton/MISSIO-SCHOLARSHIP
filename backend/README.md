# Missio Scholarship Backend

This project provides the backend API services for the Missio Scholarship application. It handles user authentication, session management, and scholarship application submissions and retrievals.

## Tech Stack

*   **Node.js**: JavaScript runtime environment.
*   **Next.js**: Framework used here for creating API routes.
*   **SQLite**: File-based SQL database, accessed using `better-sqlite3`.
*   **bcryptjs**: For hashing user passwords.
*   **jsonwebtoken**: For creating and verifying JSON Web Tokens (JWTs) for session management.
*   **cookie**: For parsing and serializing HTTP cookies.

## Setup and Running

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the `backend` directory and add your JWT secret:
    ```
    JWT_SECRET=your_very_secret_jwt_key_here
    ```
    Replace `your_very_secret_jwt_key_here` with a strong, unique secret key.

4.  **Database Initialization:**
    The SQLite database (`database.db`) and necessary tables (`users`, `scholarship_applications`) are automatically created in the `backend/lib` directory when the server starts if they don't already exist (as per `lib/db.js`).

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The backend API will typically be available at `http://localhost:3001` (or as configured).

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

*   `POST /auth/register`: Register a new user.
    *   Body: `{ email, password }`
*   `POST /auth/login`: Log in an existing user.
    *   Body: `{ email, password }`
    *   Sets an HTTP-only cookie with JWT upon success.
*   `POST /auth/logout`: Log out the current user.
    *   Clears the session cookie.
*   `GET /auth/me`: Get the current authenticated user's details (verifies session cookie).

### Scholarship Application

*   `POST /scholarship/apply`: Submit a new scholarship application or update an existing one.
    *   Requires authentication (session cookie).
    *   Body: Application form data (JSON).
*   `GET /scholarship/application`: Retrieve the current user's scholarship application details.
    *   Requires authentication (session cookie).
