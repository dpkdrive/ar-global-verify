# AR-Blobal-V1 — Product Authentication & Verification Platform (Backend)

## API (v1)

All responses use the shape `{ success, message?, data?, meta? }`. Error
responses additionally include `error.code` and a safe list of field details.
Authenticated endpoints require `Authorization: Bearer <access-token>`.

| Area | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| Health | `GET /api/health` | Public | Service and database status |
| Auth | `POST /api/v1/auth/login` | Public | Start a session; returns access token and refresh cookie |
| Auth | `POST /api/v1/auth/refresh` | Public | Rotate the browser refresh session |
| Auth | `POST /api/v1/auth/logout` | Public | Clear the refresh session |
| Auth | `GET /api/v1/auth/me` | Signed in | Current account |
| Auth | `PATCH /api/v1/auth/change-password` | Signed in | Change password and invalidate earlier sessions |
| Products | `GET, POST /api/v1/products` | Manufacturer/Admin | List or create owned products |
| Products | `GET, PATCH, DELETE /api/v1/products/:id` | Manufacturer/Admin | Read, update, or remove an owned product |
| Product codes | `POST /api/v1/products/:id/codes` | Manufacturer/Admin | Generate a batch of 1–500 unique, verification-ready codes |
| Products | `GET /api/v1/products/:id/verifications` | Manufacturer/Admin | Paginated verification history for an owned product |
| Verification | `POST /api/v1/verify` | Public | Verify an authentication code and record a privacy-safe event |
| Dashboard | `GET /api/v1/dashboard/summary` | Manufacturer/Admin | Product totals, verification totals, and recent activity |
| Dashboard | `GET /api/v1/dashboard/suspicious-products` | Manufacturer/Admin | Products at or above the suspicious-verification threshold |
| Audit logs | `GET /api/v1/audit-logs` | Manufacturer/Admin | Paginated authorized activity history |
| Users | `GET, POST /api/v1/users` | Admin | List or provision platform users |
| Users | `PATCH, DELETE /api/v1/users/:id` | Admin | Update or deactivate users |

Manufacturers can only access their own products. Administrators can manage all
products and users. Product authentication codes are immutable once issued.

### Bulk code generation

Select an existing product ID, then call `POST /api/v1/products/:id/codes` with
`{ "quantity": 100 }`. Each physical unit receives a cryptographically random,
unique code. The raw codes are returned only once in the creation response;
only HMAC hashes are stored in the database. Each returned code can be entered
into `POST /api/v1/verify` for public verification.

### First administrator

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (12+ characters), and optionally
`ADMIN_NAME` in `.env`, then run `npm run seed:admin`. The script is idempotent:
it will not overwrite an existing account.

## Phase 1 — Project Initialization

This phase establishes the project skeleton: Express server bootstrap, environment
configuration, MongoDB connection handling, folder architecture, and the health
check endpoint. No business logic (auth, products, verification) is implemented yet.

## Tech Stack

- Node.js (ES Modules, `.js` only — no TypeScript)
- Express 5
- MongoDB / Mongoose
- Pino (structured logging)

## Folder Structure

```
backend/
├── src/
│   ├── config/         # env, db connection, logger
│   ├── controllers/     # request handlers
│   ├── middlewares/      # (Phase 2+)
│   ├── models/           # (Phase 3+)
│   ├── routes/
│   ├── services/         # (Phase 3+)
│   ├── validators/       # (Phase 2+)
│   ├── utils/
│   ├── constants/
│   ├── jobs/
│   ├── app.js
│   └── server.js
├── scripts/
├── tests/
├── .env.example
├── .gitignore
└── package.json
```

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set MONGODB_URI, JWT secrets, etc.
```

## Run

Make sure MongoDB is running locally (or update `MONGODB_URI` to point to your instance):

```bash
# Development (auto-restart on file changes via Node's built-in watch mode)
npm run dev

# Production
npm start
```

On startup the server will:
1. Load and validate environment variables (fails fast if required vars are missing in production).
2. Connect to MongoDB (exits the process if the connection fails — the app never runs in a half-initialized state).
3. Start listening on `PORT` (default `5000`).

## Test

```bash
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "status": "ok",
  "data": {
    "database": "connected",
    "uptimeSeconds": 12,
    "version": "1.0.0"
  }
}
```

You can also run:

```bash
curl http://localhost:5000/api/health
```

Graceful shutdown: press `Ctrl+C` (SIGINT) or send `SIGTERM` — the server will
stop accepting new connections, close the MongoDB connection, then exit.

## Dependencies Added (Phase 1)

Installed now (some are wired up in later phases but included here so `npm install`
only needs to run once per phase batch):

- `express`, `mongoose`, `dotenv`, `cookie-parser` — used in Phase 1
- `pino`, `pino-http`, `pino-pretty` — structured logging, used in Phase 1
- `helmet`, `cors`, `express-rate-limit`, `express-mongo-sanitize` — reserved for Phase 2
- `bcrypt`, `jsonwebtoken` — reserved for Phase 3 (auth)
- `zod` — reserved for Phase 2+ (validation)
- `uuid` — reserved for later phases

## Next Phase

Phase 2: core middleware — centralized error handling, request validation,
structured request logging, Helmet, CORS, and rate limiting.

Waiting for **NEXT**.
