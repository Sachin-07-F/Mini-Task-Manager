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

## Folder Structure

```text
mini-task-manager/
├─ backend/
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
VITE_API_BASE_URL=http://localhost:5000
```

Then start frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Deployment Guide

## Backend Deployment on Render

1. Push project to GitHub.
2. In Render, create a **Web Service**.
3. Set:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
4. Deploy and copy the generated backend URL (example: `https://your-api.onrender.com`).

## Frontend Deployment on Vercel

1. In Vercel, import the same GitHub repo.
2. Set:
   - Framework preset: `Vite`
   - Root directory: `frontend`
3. Add environment variable:
   - `VITE_API_BASE_URL = https://your-api.onrender.com`
4. Deploy.

## Assumptions

- Data is intentionally in-memory as requested, so tasks reset when backend restarts.
- Toggle is implemented via `PATCH /tasks/:id/toggle` to support complete/incomplete updates cleanly.
- CORS is enabled for cross-origin local/deployed frontend-backend communication.
