# Roamly — Local setup in 60 seconds

If the app looks different on your laptop vs the hosted preview, it's almost always because the **FastAPI backend isn't running** or **`FASTAPI_URL` in `.env` doesn't match the port uvicorn is bound to**. Follow this exactly.

## 1. Prerequisites

- Node.js ≥ 18 and Yarn 1.x
- Python ≥ 3.9

## 2. First-time install

```bash
unzip roamly-airbnb-clone.zip -d roamly
cd roamly

# Copy env templates
cp .env.example .env
cp backend/.env.example backend/.env

# Install frontend deps
yarn install

# Install backend deps
python3 -m venv .venv
source .venv/bin/activate           # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
```

## 3. Run both services with ONE command

```bash
yarn dev:all
```

That command uses `concurrently` to boot:

- **FastAPI** on `http://127.0.0.1:8001` (auto-seeds SQLite with 8 stays on first boot)
- **Next.js** on `http://localhost:3000` (proxies every `/api/*` request to FastAPI)

Open http://localhost:3000 and you should see the same UI as the hosted preview, backed by a real SQLite database.

## 4. Or run them in separate terminals

```bash
# terminal 1
source .venv/bin/activate
cd backend && uvicorn main:app --host 127.0.0.1 --port 8001 --reload

# terminal 2
yarn dev
```

## Troubleshooting

**"It looks the same but bookings don't persist and any host listing I add disappears on refresh."**
→ FastAPI isn't reachable. The frontend silently falls back to the 8 built-in seed listings. Check:
1. Is `uvicorn` running on port `8001`? (visit http://127.0.0.1:8001/api/listings — you should get JSON)
2. Does `.env` contain `FASTAPI_URL=http://127.0.0.1:8001`? (this must match uvicorn's port)
3. Restart `yarn dev` after editing `.env` — Next.js only reads env vars on startup.

**"The map is blank / just shows grey."**
→ Leaflet needs internet to load OpenStreetMap tiles. Check your network.

**"`sqlite3.OperationalError: unable to open database file`"**
→ The path in `backend/.env` (`SQLITE_DB_PATH=./roamly.db`) is resolved relative to the folder uvicorn is started from. Make sure you're in the `backend/` folder when running `uvicorn`, or use an absolute path.

**"Cross origin request detected" warning in the console**
→ Safe to ignore in dev. Only matters if you deploy behind a different origin.

## Stack

| Layer    | Tech                                          |
|----------|-----------------------------------------------|
| Frontend | Next.js 15 (App Router) + TypeScript (strict) |
| UI       | Tailwind CSS + shadcn primitives + lucide     |
| Map      | Leaflet + react-leaflet + OpenStreetMap tiles |
| Backend  | FastAPI + Pydantic v2                         |
| Storage  | SQLite (auto-created + seeded on first boot)  |
| Proxy    | Next.js `rewrites()` reads `FASTAPI_URL`      |
