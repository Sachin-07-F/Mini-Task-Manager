# Mini Task Manager App

A full-stack Mini Task Manager built with React (Vite) on the frontend and Node.js + Express on the backend.  
The app supports adding, viewing, deleting, and toggling task completion status with live API integration.

## Features

- Add a new task
- View all tasks
- Delete a task
- Toggle task status (complete/incomplete)
- Fetch tasks on initial page load
- Environment-based backend URL for frontend deployment

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express, CORS
- **Storage:** In-memory array (non-persistent)
- **Hosting:** Vercel (frontend) + Render (backend)

## Folder Structure

```text
mini-task-manager/
├─ backend/
│  ├─ .env.example
│  ├─ package.json
│  └─ server.js
├─ frontend/
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ .env.example
│  ├─ index.html
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     └─ App.css
└─ README.md
```

## API Endpoints

- `GET /tasks` - Return all tasks
- `POST /tasks` - Add a new task
- `PATCH /tasks/:id/toggle` - Toggle complete/incomplete
- `DELETE /tasks/:id` - Delete a task

### Task Object Shape

```json
{
  "id": 1,
  "text": "Complete internship assignment",
  "completed": false
}
```

## Local Setup Instructions

## 1) Clone and open project

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

## 2) Run Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs at: `http://localhost:5000`

## 3) Run Frontend

In a new terminal:

```bash
cd frontend
npm install
```

Create `.env` in `frontend/` using:

```env
VITE_API_URL=http://localhost:5000
```

Then start frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Deployment Guide

## Backend Deployment on Render

1. Push the repository to GitHub.
2. In Render, create a new **Web Service** from the repo.
3. Configure:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
4. Add environment variables:
   - `PORT=10000` (optional on Render, Render provides this automatically)
   - `FRONTEND_URL=https://your-frontend.vercel.app`
   - Or use `ALLOWED_ORIGINS=https://your-frontend.vercel.app`
5. Deploy and copy the backend URL, for example `https://your-api.onrender.com`.

### Backend production notes

- The API listens on `process.env.PORT` with `5000` as the local fallback.
- CORS allows the configured frontend origin and supports `GET`, `POST`, `PATCH`, `DELETE`, and `OPTIONS`.
- Requests without an `Origin` header are still allowed for health checks and server-to-server access.

## Frontend Deployment on Vercel

1. In Vercel, import the same GitHub repo.
2. Configure:
   - Framework preset: `Vite`
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add environment variable:
   - `VITE_API_URL=https://your-api.onrender.com`
4. Deploy.

### Frontend production notes

- All frontend API calls now use `VITE_API_URL`.
- Local development still works with `http://localhost:5000` when the env variable is not set.
- No `vercel.json` is required for this project because Vercel detects Vite automatically.

## Production Deployment Flow

1. Deploy the backend to Render first.
2. Copy the Render backend URL.
3. Add that URL to Vercel as `VITE_API_URL`.
4. Copy the final Vercel frontend URL.
5. Add that URL to Render as `FRONTEND_URL` or inside `ALLOWED_ORIGINS`.
6. Redeploy the backend if you changed Render environment variables.

## Build Verification

Frontend build:

```bash
cd frontend
npm run build
```

Backend production start:

```bash
cd backend
npm start
```

## Assumptions

- Data is intentionally in-memory as requested, so tasks reset when backend restarts.
- Toggle is implemented via `PATCH /tasks/:id/toggle` to support complete/incomplete updates cleanly.
- CORS is enabled for local and deployed frontend-backend communication through environment-based allowed origins.
