<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Brighte Eats

This little project is a GraphQL API designed to capture customer interest for a new food service platform. The API collects and organizes expressions of interest, specifically tracking customer preferences for three key offerings: delivery services, in-store pickup options, and integrated payment processing.

## Technology Stack

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Apollo](https://img.shields.io/badge/Apollo_Server-311C87?style=for-the-badge&logo=apollo-graphql&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js_20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

- **Backend Framework**: NestJS
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Containerization**: Docker & Docker Compose
- **Development Tools**: Prisma Studio, pgAdmin
- **Runtime**: Node.js 20

## Prerequisites

- Docker Desktop (recommended)
- Node.js (v20 or later)
- npm (v9 or later)

## Quick Start

### First-time Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kel-flrs/brighte-tucker-graphql-api.git
   cd brighte-tucker-graphql-api
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
3. **Install dependencies**
   ```bash
   npm install --force
   ```
4. **Start your Docker engine through Docker Desktop (recommended)**

5. **Make the run script executable**
   ```bash
   chmod +x run.sh
   ```

6. **Start the Docker environment**
   ```bash
   ./run.sh
   ```

The application will be available at the following url:
- GraphQL API: http://localhost:3000/graphql
- Prisma Studio: http://localhost:5555
- pgAdmin: http://localhost:8080

### Stopping/Restarting Docker Containers

To stop or restart docker containers, you can use the following commands in your terminal:

- **Stop Docker containers**:
  ```bash
  Windows & Linux: Ctrl + C and press any key
  Mac: Cmd + C
  ```

- **Build and Run again**:
  ```bash
  ./run.sh
  ```

## Docker Services

The application consists of the following Docker services:

### 1. PostgreSQL Database (`postgres`)
- **Port**: 5433 (mapped to internal 5432)
- **Credentials**: Defined in your `.env` file
- **Volumes**: Persistent data storage using Docker volumes
- **Health Check**: The service performs health checks to ensure the database is ready before dependent services start

### 2. API Service (`api`)
- **Port**: 3000
- **Technology**: NestJS with GraphQL
- **Startup Sequence**: 
  - Deploys Prisma migrations
  - Generates Prisma client
  - Seeds the database
  - Starts the development server

### 3. Prisma Studio (`prisma-studio`)
- **Port**: 5555
- **Purpose**: Database visualization and management tool
- **Usage**: Access via browser at http://localhost:5555

### 4. pgAdmin (`pgadmin`)
- **Port**: 8080
- **Credentials**: Defined in your `.env` file
- **Purpose**: PostgreSQL database administration tool
- **Usage**: Access via browser at http://localhost:8080

## Environment Configuration

The application uses environment variables for configuration. Copy the `.env.example` file to `.env` and adjust as needed:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=brighte_eats
POSTGRES_PORT=5432

PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin
```

## Database Management Options

There are two primary ways to interact with and view the database tables and records in this application. I recommend using Prisma Studio for most development tasks due to its simplicity and direct integration with the Prisma schema.

### Option 1: Prisma Studio (Recommended)

Prisma Studio provides a simple, intuitive interface for viewing and modifying your database data that directly reflects your Prisma schema.

1. Access Prisma Studio at http://localhost:5555 after starting the Docker environment.
2. You'll see a list of all models defined in your Prisma schema (e.g., "Lead").
3. Click on a model to view, filter, and edit records.
4. Changes made in Prisma Studio are immediately reflected in the database.

No additional configuration is required, making this the simplest option for database management during development.

### Option 2: pgAdmin

pgAdmin provides more advanced database administration capabilities. While it requires more initial setup, it offers additional features for database management, performance monitoring, and SQL querying.

#### Accessing pgAdmin

1. Open your web browser and navigate to http://localhost:8080.
2. Log in using the credentials specified in your `.env` file:
   - Email: The value of `PGADMIN_EMAIL` (default: admin@example.com)
   - Password: The value of `PGADMIN_PASSWORD` (default: admin)

#### Connecting to the PostgreSQL Database

1. After logging in, right-click on "Servers" in the left sidebar and select "Register" → "Server...".
2. In the "General" tab, enter a name for your server connection (e.g., "Brighte Eats DB").
3. Switch to the "Connection" tab and enter the following details:
   - Host name/address: `postgres` (this is the Docker service name, not localhost)
   - Port: `5432` (the internal PostgreSQL port, not the mapped port)
   - Username: The value of `POSTGRES_USER` (default: postgres)
   - Password: The value of `POSTGRES_PASSWORD` (default: postgres)
4. Click "Save" to establish the connection.

#### Exploring the Database

1. Expand the server you just created in the left sidebar.
2. Navigate to "Databases" → "[Your Database Name]" → "Schemas" → "public" → "Tables".
3. Right-click on the "leads" table and select "View/Edit Data" → "All Rows" to see the table contents.
4. You can execute custom SQL queries by selecting "Tools" → "Query Tool" from the top menu.

## API Documentation

### GraphQL Schema

The API provides the following GraphQL operations:

#### Queries
- `leads`: Fetch all customer leads
- `lead(id: Int!)`: Fetch a specific lead by ID

#### Mutations
- `register(input: RegisterInput!)`: Register a new customer lead

#### Models
- `Lead`: Represents a customer lead
- `Services`: Enum of available services (DELIVERY, PICKUP, PAYMENT)

### Example Queries

#### Register a new lead
```graphql
mutation {
  register(input: {
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "+61412345678",
    postcode: "2000",
    services: [DELIVERY, PAYMENT]
  }) {
    success
    id
    email
  }
}
```

#### Get all leads
```graphql
query {
  leads {
    id
    name
    email
    mobile
    postcode
    services
  }
}
```

#### Get lead by ID
```graphql
query {
  lead(id: 1) {
    id
    name
    email
    mobile
    postcode
    services
  }
}
```

## Run unit tests

```
npm run test
```

## Project Structure

```
.
├── Dockerfile              # Docker configuration for the API service
├── docker-compose.yml      # Docker Compose configuration
├── run.sh                  # Docker environment management script
├── package.json            # Node.js dependencies and scripts
├── prisma/                 # Prisma ORM configuration
│   ├── schema.prisma       # Database schema definition
│   ├── seed.ts             # Database seeding script
│   └── migrations/         # Database migration files
├── src/                    # Application source code
│   ├── graphql/            # GraphQL schema
│   ├── common/             # Shared utilities and helpers
│   └── modules/            # Application modules
│       ├── leads/          # Leads management module
│       └── prisma/         # Prisma service module
└── .env.example            # Example environment variables
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL container is running: `docker ps`
- Check database credentials in `.env` file
- Verify network connectivity: `docker network ls`

### API Service Startup Issues
- Check logs: `docker-compose logs api`
- Ensure database is accessible: `docker-compose logs postgres`
- Verify Prisma migrations: `docker-compose exec api npm run prisma:migrate -- --create-only`
