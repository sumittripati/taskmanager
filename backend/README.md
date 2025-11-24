# Task Management Backend

This is the backend API for the Task Management application, built with Node.js, TypeScript, and Prisma.

## Prerequisites

- Node.js installed
- PostgreSQL database (connection string in `.env`)

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Setup**:
    Generate the Prisma client and push the schema to your database:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

## Running the Server

To start the development server:
```bash
npm run dev
```
The server will start on `http://localhost:4000`.

## Verification

To run the automated verification script (tests all endpoints):
```bash
npx ts-node test-endpoints.ts
```

## API Endpoints

- **Auth**:
    - `POST /auth/register`: Register a new user
    - `POST /auth/login`: Login
    - `POST /auth/refresh`: Refresh access token
    - `POST /auth/logout`: Logout
- **Tasks**:
    - `GET /tasks`: List tasks (query params: `page`, `limit`, `status`, `search`)
    - `POST /tasks`: Create a task
    - `GET /tasks/:id`: Get a task
    - `PATCH /tasks/:id`: Update a task
    - `PATCH /tasks/:id/toggle`: Toggle task status
    - `DELETE /tasks/:id`: Delete a task
