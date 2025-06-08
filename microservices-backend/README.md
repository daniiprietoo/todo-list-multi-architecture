# Todo List Microservices Architecture

A full-stack Todo List application using a microservices architecture. The backend is split into multiple services (API Gateway, Users Service, Todos Service), each built with Node.js, Express, TypeScript, Drizzle ORM, and PostgreSQL. The frontend is a modern React app using Vite, TypeScript, Tailwind CSS, and Shadcn UI.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Shadcn UI
- **API Gateway**: Node.js, Express, TypeScript, http-proxy-middleware
- **Users Service**: Node.js, Express, TypeScript, Drizzle ORM, PostgreSQL
- **Todos Service**: Node.js, Express, TypeScript, Drizzle ORM, PostgreSQL
- **Database**: PostgreSQL (each service can use its own DB or share one)
- **API Documentation**: Swagger UI (per service)

## Project Structure

```
todo-list-microservices/
  api-gateway/      # API Gateway (routes requests to services)
  users-service/    # User management microservice
  todos-service/    # Todo/task management microservice
  frontend/         # React app (Vite, Tailwind CSS, Shadcn UI)
  package.json      # Monorepo scripts
```

## Diagram

![image](https://github.com/user-attachments/assets/0da5ef26-c6ff-4252-9bae-cc70a1dbd020)

## Explanation

### Frontend

- **React App**: The user interface of the application, built with React and styled using Tailwind CSS and Shadcn UI.
- **API Layer (Axios)**: Handles all HTTP requests from the frontend to the backend. All API calls are made through this layer.

### Proxy /api/

- **Vite Proxy**: All requests from the frontend that start with `/api` are proxied to the API Gateway. This abstracts backend service URLs from the frontend and avoids CORS issues.

### Backend

#### API Gateway

- **API Gateway**: Acts as the single entry point for all client requests. It proxies requests to the appropriate backend service based on the route:
  - `/api/users` → User Service
  - `/api/tasks` → Todos Service
- **Uses** (Cross-cutting concerns):
  - **Logging**: Records important events, errors, and requests for debugging and monitoring.
  - **Error Handling**: Catches and processes errors that occur during request handling, ensuring consistent error responses.
  - **Rate-Limiting**: Prevents abuse by limiting how many requests a client can make in a certain period.

#### User Service

- **Routes**: Define API endpoints for user-related operations (registration, login, fetch user, etc.).
- **Controllers**: Handle incoming requests, validate inputs, call services, and return responses.
- **Services**: Contain business logic for user management, coordinate between controllers and repositories.
- **Zod (Validation)**: Validates incoming data to ensure it meets required schemas before processing.
- **Repositories**: Handle database operations for users, abstracting the database layer from the services.
- **Drizzle ORM**: Provides a type-safe way to interact with the PostgreSQL database.
- **PostgreSQL**: Stores user data persistently.

#### Todos Service

- **Routes**: Define API endpoints for todo/task-related operations (CRUD tasks, etc.).
- **Controllers**: Handle incoming requests, validate inputs, call services, and return responses.
- **Services**: Contain business logic for todo management, coordinate between controllers and repositories. Also validate user existence by communicating with the User Service.
- **Zod (Validation)**: Validates incoming data to ensure it meets required schemas before processing.
- **Repositories**: Handle database operations for todos, abstracting the database layer from the services.
- **Drizzle ORM**: Provides a type-safe way to interact with the PostgreSQL database.
- **PostgreSQL**: Stores todo/task data persistently.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database (can be shared or separate for each service)

### 1. Clone the repository

```bash
git clone https://github.com/daniiprietoo/todo-list-microservices.git
cd todo-list-microservices
```

### 2. Install dependencies (monorepo)

```bash
npm install
```

### 3. Configure environment variables

- Copy `.env.example` (if available) or create `.env` files in each service directory (`api-gateway/`, `users-service/`, `todos-service/`).
- Set the following variables as needed:
  - **API Gateway**: `FRONTEND_URL`, `USERS_SERVICE_URL`, `TODOS_SERVICE_URL`
  - **Users Service**: `DATABASE_URL`, `FRONTEND_URL`
  - **Todos Service**: `DATABASE_URL`, `FRONTEND_URL`, `USERS_SERVICE_URL`

Example for `api-gateway/.env`:

```
FRONTEND_URL=http://localhost:5173
USERS_SERVICE_URL=http://localhost:4001
TODOS_SERVICE_URL=http://localhost:4002
```

### 4. Run database migrations

For each service that uses a database (users-service, todos-service):

```bash
cd users-service
npx drizzle-kit push:pg
cd ../todos-service
npx drizzle-kit push:pg
cd ..
```

### 5. Start the development servers

From the root directory:

```bash
npm run dev
```

- This will start all services concurrently:
  - **Frontend**: [http://localhost:5173](http://localhost:5173)
  - **API Gateway**: [http://localhost:3000](http://localhost:3000)
  - **Users Service**: [http://localhost:4001](http://localhost:4001)
  - **Todos Service**: [http://localhost:4002](http://localhost:4002)
- The frontend is configured to proxy API requests (`/api`) to the API Gateway.

### 6. Open the app

Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

- `npm run dev` — Start all services in development mode (monorepo)
- `npm run dev:frontend` — Start frontend only
- `npm run dev:api-gateway` — Start API Gateway only
- `npm run dev:users-service` — Start Users Service only
- `npm run dev:todos-service` — Start Todos Service only

## API Documentation

- **Users Service Swagger UI**: [http://localhost:4001/docs](http://localhost:4001/docs)
- **Todos Service Swagger UI**: [http://localhost:4002/docs](http://localhost:4002/docs)

## Notes

- Each service can be developed, tested, and deployed independently.
- The API Gateway abstracts the backend services from the frontend and handles cross-cutting concerns (CORS, rate limiting, etc).
- The system is designed for extensibility—new services can be added and integrated via the API Gateway.
