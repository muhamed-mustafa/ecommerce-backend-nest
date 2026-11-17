# E-commerce Backend (NestJS)

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-TypeORM-4169E1?logo=postgresql&logoColor=white)

A REST API for a small e-commerce catalogue built with NestJS, TypeORM and PostgreSQL: JWT authentication, role-based access, products, reviews and user management.

The project is a modular NestJS backend covering the core concerns of a typical API: authentication with email verification, role guards, request validation, relational modelling with migrations, file upload, rate limiting, OpenAPI documentation and both unit and end-to-end tests. Its scope is intentionally limited to users, products and reviews; there is no cart, order or payment flow.

## Features

- **Authentication** — sign-up and sign-in with bcrypt-hashed passwords and JWT access tokens.
- **Email verification** — a verification link is emailed on sign-up (Nodemailer with an EJS template); visiting it marks the account as verified.
- **Role-based access control** — `admin` and `user` roles enforced by a custom guard and a `@Role()` decorator; a `@CurrentUser()` decorator exposes the JWT payload to handlers.
- **Products** — CRUD with admin-only writes, case-insensitive name search and min/max price filtering.
- **Reviews** — rated reviews (1–5) per product, paginated listing, and author-only update and delete.
- **Users** — admin listing, profile update (username, password) and account deletion.
- **Profile image upload** — optional multipart upload at sign-up, stored on local disk and served statically from `/uploads`.
- **Validation and serialization** — global `ValidationPipe` (whitelist + transform) and `ClassSerializerInterceptor`, so password hashes never leave the API.
- **Rate limiting and headers** — global `@nestjs/throttler` guard and `helmet`.
- **API documentation** — Swagger UI generated from the controllers and DTOs.
- **Database migrations** — TypeORM data source with an initial migration for the `users`, `products` and `reviews` tables.

## Architecture

```
.
├── db/
│   ├── data-source.ts          # TypeORM DataSource shared by the app and the CLI
│   └── migrations/             # Initial schema migration
├── src/
│   ├── main.ts                 # Bootstrap: global prefix, pipes, helmet, Swagger
│   ├── app.module.ts           # Root module: config, throttler, TypeORM, global providers
│   ├── auth/                   # Sign-up, sign-in, verification, guards, decorators, DTOs
│   ├── user/                   # User entity, service, admin/user endpoints
│   ├── product/                # Product entity, CRUD, filters, Swagger decorators
│   ├── review/                 # Review entity, CRUD scoped to product and author
│   ├── mail/                   # Mailer module and EJS templates
│   └── utils/                  # Enums, JWT payload type, Multer storage, constants
├── test/                       # End-to-end tests (Supertest)
└── vercel.json
```

Each domain is a self-contained NestJS module with its own controller, service, entity and DTOs. `UserModule` owns the user repository and the JWT configuration and exports both; `AuthModule` builds on it and adds mail and upload handling; `ProductModule` and `ReviewModule` depend on `AuthModule` to resolve the acting user.

The data model is three entities: a `User` has many `Product`s and many `Review`s, and a `Product` has many `Review`s, with cascading deletes at the foreign-key level. The schema is managed through migrations rather than `synchronize`.

Cross-cutting behaviour is registered once in `AppModule` as global providers: the validation pipe, the class serializer interceptor and the throttler guard. Authorization is opt-in per route through `AuthRoleGuard`, which verifies the bearer token, loads the user and checks the role against the route metadata.

## Tech Stack

| Area | Technology |
| --- | --- |
| Runtime / language | Node.js, TypeScript |
| Framework | NestJS 11 (Express platform) |
| Database / ORM | PostgreSQL, TypeORM 0.3 |
| Auth | `@nestjs/jwt`, `bcryptjs` |
| Validation | `class-validator`, `class-transformer` |
| Mail | `@nestjs-modules/mailer`, Nodemailer, EJS |
| Uploads | Multer (disk storage) |
| Security | `helmet`, `@nestjs/throttler` |
| Docs | `@nestjs/swagger` |
| Testing | Jest, Supertest |

## Getting Started

### Prerequisites

- Node.js 20 or later
- pnpm
- A PostgreSQL database
- SMTP credentials (sign-up sends a verification email)

### Install

```bash
git clone https://github.com/muhamed-mustafa/ecommerce-backend-nest.git
cd ecommerce-backend-nest
pnpm install
```

### Configure

Create a `.env` file in the project root with the variables listed below. The TypeORM data source reads `.env` directly; the application additionally loads `.env.<NODE_ENV>` (for example `.env.development`) when `NODE_ENV` is not `production`.

### Database

```bash
pnpm migration:run      # build, then apply migrations from dist/db/migrations
pnpm migration:revert   # revert the last migration
```

### Run

```bash
pnpm start:dev          # watch mode, NODE_ENV=development
pnpm build              # compile to dist/
```

The API listens on `PORT` (default `3000`) under the `/api` prefix.

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by the app and the TypeORM CLI |
| `JWT_SECRET` | Secret used to sign and verify access tokens |
| `JWT_EXPIRATION` | Access token lifetime (for example `1d`) |
| `DOMAIN` | Public base URL of the API, used to build the email verification link |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USERNAME` | SMTP account username |
| `SMTP_PASSWORD` | SMTP account password |
| `PORT` | HTTP port (optional, defaults to `3000`) |
| `NODE_ENV` | Selects the env file (`.env.<NODE_ENV>`); set by the `start:dev` and test scripts |

## API Overview

All routes are prefixed with `/api`. Protected routes expect `Authorization: Bearer <token>`. Swagger UI is served at `/swagger`.

| Module | Method | Path | Purpose | Access |
| --- | --- | --- | --- | --- |
| Auth | POST | `/auth/signup` | Register (multipart; optional `profileImage`), send verification email | Public |
| Auth | POST | `/auth/signin` | Sign in, returns user and token | Public |
| Auth | GET | `/auth/current-user` | Return the authenticated user | Authenticated |
| Auth | GET | `/auth/verify/:id/:verificationToken` | Verify an email address | Public |
| Users | GET | `/users` | List users | Admin |
| Users | PATCH | `/users/:id` | Update username or password | Admin, User |
| Users | DELETE | `/users/:id` | Delete a user | Admin, User |
| Products | POST | `/products` | Create a product | Admin |
| Products | GET | `/products` | List products; filters: `name`, `minPrice`, `maxPrice` | Public |
| Products | GET | `/products/:id` | Get a product with its reviews | Public |
| Products | PATCH | `/products/:id` | Update a product | Admin |
| Products | DELETE | `/products/:id` | Delete a product | Admin |
| Reviews | POST | `/reviews/:productId` | Add a review to a product | Admin, User |
| Reviews | GET | `/reviews/:productId` | List a product's reviews; `page`, `limit` | Public |
| Reviews | PATCH | `/reviews/:reviewId` | Update a review | Review author |
| Reviews | DELETE | `/reviews/:reviewId` | Delete a review | Review author |

## Testing

```bash
pnpm test        # unit tests (Jest, src/**/*.spec.ts)
pnpm test:cov    # unit tests with coverage
pnpm test:e2e    # end-to-end tests (test/*.e2e-spec.ts)
```

- **Unit tests** — `ProductService` and `ProductController` are covered against mocked repositories and services (create, list with filters, find, update, delete, not-found paths). `AuthService` has an initial sign-up test. The remaining spec files are scaffolds.
- **End-to-end tests** — `test/products.e2e-spec.ts` boots the full application and exercises the product endpoints through Supertest, including authentication (401), validation (400) and not-found (404) cases.

The e2e suite runs against the database in `DATABASE_URL` and deletes all rows from `products` and `users` after each test. Point it at a dedicated test database with migrations applied.

## Project Status / Roadmap

This is a learning and portfolio project. The auth, user, product and review modules are functional; the following is known to be incomplete or open:

- No cart, order or payment modules.
- User update and delete do not yet check that the caller owns the account.
- Sign-in does not require a verified email.
- Product listing has filters but no pagination; reviews are paginated.
- Uploaded images are stored on local disk with no file type or size restrictions; object storage would be needed for a stateless deployment.
- Throttler limits are strict placeholder values and need tuning per route.
- Unit tests for auth, users, reviews and mail are still scaffolds.
- A `vercel.json` is included, but no public deployment is documented here.
- No Docker setup or CI pipeline yet.

## Author

[muhamed-mustafa](https://github.com/muhamed-mustafa)
