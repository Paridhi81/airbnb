# Roamly Marketplace

Roamly is a photo-forward Airbnb-inspired stay marketplace with a Next.js frontend and a standalone FastAPI + SQLite backend. It includes seeded homes, browse/search/filter experiences, listing details, date and guest validation, mocked checkout, My Trips, favorites, static map mode, and host listing CRUD.

## Included

- Responsive marketplace home with listing cards, category rail, search, filters, wishlist hearts, and static map pins
- Listing detail gallery with amenities, host details, reviews, availability fields, guest controls, and price breakdown
- End-to-end booking flow with overlap protection, guest capacity checks, persistent bookings, and My Trips
- Host dashboard with persistent create, edit, and delete listing actions plus booking visibility
- **MOCKED checkout**: no real payment provider or card data is stored
- **COMING SOON** dialogs for messaging, identity verification, login/signup, language/currency, Experiences, and Services

## Run locally with FastAPI + SQLite

1. Copy `.env.example` to `.env` and set `FASTAPI_URL` to the address where the API will run.
2. Install frontend packages with `yarn install`.
3. Install backend packages with `python -m pip install -r backend/requirements.txt`.
4. Start FastAPI from the project root with `uvicorn backend.main:app --reload`.
5. Start Next.js in a second terminal with `yarn dev`.
6. Open the local app at the URL provided by your Next.js runtime.

The Next.js rewrite reads `FASTAPI_URL` and forwards `/api/*` requests to FastAPI. SQLite is created automatically at `SQLITE_DB_PATH` and seeded on the first startup. Do not commit a real `.env` file or credentials.

## Architecture

- `app/page.js` — client-side marketplace UI and booking/host interactions
- `app/layout.js` — page metadata and root layout
- `backend/main.py` — FastAPI routes, SQLite schema creation, seed data, and booking rules
- `backend/schema.sql` — SQLite schema notes
- `next.config.js` — env-driven `/api/*` rewrite to FastAPI
- SQLite tables: `listings` and `bookings`
- Every application record uses a UUID-style `id`; SQLite row internals are never exposed

## API overview

- `GET /api/listings` — seeded listings with optional `q`, `category`, and `maxPrice` filters
- `GET /api/listings/:id` — listing details
- `POST /api/listings` — create a host listing
- `PUT /api/listings/:id` — update a listing
- `DELETE /api/listings/:id` — remove a listing
- `GET /api/bookings?guestId=guest-demo` — guest trips
- `POST /api/bookings` — validate and create a booking
- `GET /api/host/listings?hostId=host-demo` — host listings and bookings

## Assumptions

The hosted preview service cannot be reconfigured from this workspace to run a second Python process, so use the downloadable source for the exact stack. Checkout, authentication, messaging, identity verification, live maps, and external integrations are intentionally represented as product flows or coming-soon states.