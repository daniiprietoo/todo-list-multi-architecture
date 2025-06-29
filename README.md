# Todo List Multi-Architecture

A full-stack Todo List application demonstrating three different backend architectures: **Monolith**, **Layered**, and **Microservices**. The frontend is a React app using Vite, TypeScript, Tailwind, and Shadcn. This is an educational project to learn about different backend architectures.

---

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind, Shadcn
- **Monolith Backend**: Node.js, Express, TypeScript, Drizzle, PostgreSQL
- **Layered Backend**: Node.js, Express, TypeScript, Drizzle, PostgreSQL
- **Microservices Backend**:
  - **API Gateway**: Node.js, Express, TypeScript, http-proxy-middleware
  - **Users Service**: Node.js, Express, TypeScript, Drizzle, PostgreSQL
  - **Todos Service**: Node.js, Express, TypeScript, Drizzle, PostgreSQL
- **Database**: PostgreSQL (shared but could be separate)
- **API Documentation**: Swagger

---

## Project Structure

```
todo-list-multi-architecture/
  frontend/             # React app (Vite, Tailwind, Shadcn)
  monolith-backend/     # Monolithic backend (single codebase)
  layered-backend/      # Layered backend (separated by layers)
  microservices-backend/
    api-gateway/        # API Gateway (routes requests to services)
    users-service/      # User microservice
    todos-service/      # Todos microservice
  package.json          # Monorepo scripts
```

---

## Architecture Overview

### Frontend

- **React App**: User interface built with React, styled using Tailwind and Shadcn.
- **API Layer (Axios)**: Handles all HTTP requests to the backend. The frontend can target any backend architecture (monolith, layered, or microservices) via a selector.

### Backends

#### Monolith Backend

- **Single Express app**: All features (users, todos) in one file.
- **Structure**: Controllers, models, routes, middleware, etc. in a single file.
- **Drizzle**: Type-safe DB access.
- **PostgreSQL**: Database.

#### Layered Backend

- **Layered Express app**: Codebase separated by layers (controllers, services, repositories, models, etc.).
- **Improved separation of concerns**: Each layer has a clear responsibility.
- **Drizzle**: Type-safe DB access.
- **PostgreSQL**: Database.

#### Microservices Backend

- **API Gateway**: Single entry point, proxies requests to services based on route:
  - `/api/users` → Users Service
  - `/api/tasks` → Todos Service
- **Users Service**: Handles user registration, login, and user data.
- **Todos Service**: Handles todo/task CRUD, validates user existence via Users Service.
- **Drizzle**: Type-safe DB access in each service.
- **PostgreSQL**: Database.
- **Swagger**: API docs for each service.

---

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL database (I used Docker to spin up a local instance for development)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/todo-list-multi-architecture.git
cd todo-list-multi-architecture
```

### 2. Install dependencies

Install dependencies for each backend and frontend with:

```bash
npm install
```

### 3. Configure environment variables

- Copy `.env.example` (if available) or create `.env` files in each backend directory (`monolith-backend/`, `layered-backend/`, `microservices-backend/api-gateway/`, `microservices-backend/users-service/`, `microservices-backend/todos-service/`).
- Set the following variables as needed:
  - **Frontend**: `VITE_API_URL` (if needed)
  - **Monolith Backend**: `DATABASE_URL`, `FRONTEND_URL`
  - **Layered Backend**: `DATABASE_URL`, `FRONTEND_URL`
  - **Microservices**:
    - **API Gateway**: `FRONTEND_URL`, `USERS_SERVICE_URL`, `TODOS_SERVICE_URL`
    - **Users Service**: `DATABASE_URL`, `FRONTEND_URL`
    - **Todos Service**: `DATABASE_URL`, `FRONTEND_URL`, `USERS_SERVICE_URL`

Example for `microservices-backend/api-gateway/.env`:

```
FRONTEND_URL=http://localhost:5173
USERS_SERVICE_URL=http://localhost:5001
TODOS_SERVICE_URL=http://localhost:5002
```

### 4. Run database migrations

If using different databases for each backend:

```bash
# Monolith
cd monolith-backend
npx drizzle-kit push
cd ..

# Layered
cd layered-backend
npx drizzle-kit push
cd ..

# Microservices
cd microservices-backend/users-service
npx drizzle-kit push
cd ../todos-service
npx drizzle-kit push
cd ../../..
```

If using the same database for all backends (just run this once):

```bash
cd monolith-backend 
npx drizzle-kit push
```

### 5. Start the development servers

From the root:

```bash
npm run dev
```

- This will start all services concurrently (if configured in the root `package.json`):
  - **Frontend**: [http://localhost:5173](http://localhost:5173)
  - **Monolith Backend**: [http://localhost:3000](http://localhost:3000)
  - **Layered Backend**: [http://localhost:4000](http://localhost:4000)
  - **Microservices API Gateway**: [http://localhost:5000](http://localhost:5000)
  - **Microservices Users Service**: [http://localhost:4001](http://localhost:4001)
  - **Microservices Todos Service**: [http://localhost:4002](http://localhost:4002)

> You can run each backend independently using their own scripts.

### 6. Open the app

Visit [http://localhost:5173](http://localhost:5173) in your browser. (default)

---

## Scripts

- `npm run dev` — Start all services in development mode
- `npm run dev:frontend` — Start frontend only
- `npm run dev:monolith` — Start monolith backend only
- `npm run dev:layered` — Start layered backend only
- `npm run dev:microservices` — Start all microservices (API Gateway, Users, Todos)
- `npm run dev:api-gateway` — Start API Gateway only
- `npm run dev:users-service` — Start Users Service only
- `npm run dev:todos-service` — Start Todos Service only

---

## API Documentation

- **Monolith Backend Swagger UI**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Layered Backend Swagger UI**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **Microservices Users Service Swagger UI**: [http://localhost:5001/docs](http://localhost:5001/docs)
- **Microservices Todos Service Swagger UI**: [http://localhost:5002/docs](http://localhost:5002/docs)

---

## Notes

- I developed each backend separately, started with monolith, then refactored to layered, then microservices.
- The frontend can switch between architectures.

## Working on

- [x] add a docker compose file to run each backend in a container
- [x] deploy backends to railway and frontend to vercel
- [ ] Tracing for the different backends to see the flow of requests
- [ ] jwt auth for authentication
- [ ] make this a production ready app (CI/CD, monitoring, logging, etc.)
