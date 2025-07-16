# Express Backend Template

A robust, feature-rich Express.js backend template built with TypeScript, designed to kickstart your web application development with best practices and modern tools.

## Features

- **TypeScript Support**: Fully typed codebase for better developer experience and code quality

- **Authentication**: Complete authentication system using Better-Auth

- Email/Password authentication

- Email verification

- Password reset

- Session management

- **Database Integration**: PostgreSQL with Drizzle ORM

- Migration management

- Schema validation with Zod

- Database studio for visual management

- **API Documentation**: Swagger UI for API documentation

- **Real-time Communication**: Socket.IO integration for WebSocket support

- **Security Features**:

- Rate limiting with rate-limiter-flexible

- Helmet for HTTP security headers

- CORS configuration

- Cookie security

- **File Storage**: Cloudinary integration for image and file uploads

- **Email Service**: Brevo (formerly Sendinblue) integration for transactional emails

- **Logging**: Pino logger with pretty printing

- **Environment Management**: Zod validation for environment variables

- **Frontend Support**: Static file serving with Tailwind CSS integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)

- PostgreSQL database

- npm or yarn

### Installation

1. Clone the repository

```bash

git  clone  <repository-url>

cd  node-started

```

2. Install dependencies

```bash

npm  install

# or

yarn  install

```

3. Set up environment variables

Update the following variables in the `.env` file:

```

CONNECTION_URL=your_postgres_connection_string

COOKIE_SECRET=your_random_secret

JWT_SECRET=your_random_secret

FRONTEND_DOMAIN=http://localhost:4000

BACKEND_DOMAIN=http://localhost:3000



# For Cloudinary (optional)

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret



# For Brevo Email (optional)

BREVO_API_KEY=your_brevo_api_key

BREVO_SENDER=your_sender_email




```

4. Generate database schema

```bash

npm  run  dbgenerate

```

5. Push schema to database

```bash

npm  run  dbpush

```

### Running the Application

#### Development Mode

```bash

npm  run  dev

```

This will start the server with hot-reloading using ts-node-dev.

#### Production Build

```bash

npm  run  build

npm  start

```

### Database Management

- Generate migration files: `npm run dbgenerate`

- Push schema changes to database: `npm run dbpush`

- Start database studio UI: `npm run dbstudio`

- Drop database schema: `npm run dbdrop`

- Introspect existing database: `npm run dbintrospect`

### API Documentation

Once the server is running, you can access the Swagger documentation at:

- `/api/docs` - Swagger UI

- `/api/docs-json` - Swagger JSON specification

## Project Structure

```

├── src/

│ ├── configs/ # Configuration files

│ ├── controllers/ # Route controllers

│ ├── events/ # Socket.IO event handlers

│ ├── lib/ # Core libraries

│ ├── middlewares/ # Express middlewares

│ ├── routes/ # API routes

│ ├── schema/ # Database schema

│ ├── types/ # TypeScript type definitions

│ ├── utils/ # Utility functions

│ └── server.ts # Main application entry

├── public/ # Static files

├── drizzle.config.ts # Drizzle ORM configuration

├── tsconfig.json # TypeScript configuration

└── package.json # Project dependencies

```

## Middleware Features

- **Authentication Middleware**: Protect routes with `isAuthenticated` and `isUnAuthenticated` middlewares

- Access user session via `req.session` in protected routes

- User data available through `req.session.user`

- **Socket IO Integration**: WebSocket support with authentication

- Socket IO instance available via `req.io` in Express routes

- Authenticated socket connections with user session binding

- Users automatically join rooms with their user ID for easy direct messaging

## Key Technologies

- **Express.js**: Web framework

- **TypeScript**: Programming language

- **PostgreSQL**: Database

- **Drizzle ORM**: Database ORM

- **Better-Auth**: Authentication library

- **Socket IO**: WebSocket library

- **Swagger**: API documentation

- **Pino**: Logging

- **Helmet**: Security headers

- **Cloudinary**: File storage

- **Brevo**: Email service

- **Tailwind CSS**: Utility-first CSS framework

## License

ISC
