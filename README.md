# Roamly Marketplace

Roamly is a photo-forward Airbnb-inspired stay marketplace built for the provided Next.js + MongoDB workspace. It includes seeded homes, browse/search/filter experiences, listing details, date and guest validation, mocked checkout, My Trips, favorites, static map mode, and host listing CRUD.

## Included

- Responsive marketplace home with listing cards, category rail, search, filters, wishlist hearts, and static map pins
- Listing detail gallery with amenities, host details, reviews, availability fields, guest controls, and price breakdown
- End-to-end booking flow with overlap protection, guest capacity checks, persistent bookings, and My Trips
- Host dashboard with persistent create, edit, and delete listing actions plus booking visibility
- **MOCKED checkout**: no real payment provider or card data is stored
- **COMING SOON** dialogs for messaging, identity verification, login/signup, language/currency, Experiences, and Services

## Run locally

1. Copy `.env.example` to `.env` and fill in the MongoDB values used by your environment.
2. Install packages with `yarn install`.
3. Start the app with `yarn dev`.
4. Open the local app at the URL provided by your Next.js runtime.

The protected workspace expects the API to use `process.env.MONGO_URL` and `process.env.DB_NAME`. Do not commit a real `.env` file or credentials.

## Architecture

- `app/page.js` — client-side marketplace UI and booking/host interactions
- `app/layout.js` — page metadata and root layout
- `app/api/[[...path]]/route.js` — Next.js API handlers for listings, bookings, and host CRUD
- MongoDB collections: `stays` and `bookings`
- Every application record uses a UUID-style `id`; Mongo internal `_id` values are removed from API responses

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

The supplied runtime is a Next.js + MongoDB template, so the working implementation uses its protected architecture rather than introducing a separate FastAPI/SQLite service. Checkout, authentication, messaging, identity verification, live maps, and external integrations are intentionally represented as product flows or coming-soon states.