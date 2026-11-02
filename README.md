# IMovies — MERN Movie Ticket Booking

A starter full-stack cinema booking project built with React + Vite, Express, Node.js and MongoDB.

## Features in this starter
- Responsive movie listing and search
- Express REST API with MongoDB/Mongoose
- Register/login with bcrypt password hashing and JWT
- Protected booking endpoint
- Basic show/seat booking model
- GitHub-ready structure

> This is a learning/MVP starter, not a production payment system. Payment processing and race-safe seat locking are not implemented. Do not store real payment-card details.

## Requirements
- Node.js 18+ (recommended; current LTS is best)
- npm
- MongoDB local installation or MongoDB Atlas account
- VS Code
- Optional: Postman

## 1. Start MongoDB
Use local MongoDB or create a MongoDB Atlas cluster. Copy the connection URI.

## 2. Configure the backend
```bash
cd server
npm install
```
Copy `.env.example` to `.env` and set `MONGO_URI` and a long random `JWT_SECRET`.

Run:
```bash
npm run dev
```
API runs at http://localhost:5000

## 3. Configure the frontend
Open a second VS Code terminal:
```bash
cd client
npm install
npm run dev
```
Open the URL Vite prints (normally http://localhost:5173).

## 4. Add sample movies
Use MongoDB Compass or `mongosh` and insert documents into the `movies` collection, for example:
```json
{
  "title": "Interstellar",
  "description": "A team travels beyond this galaxy to discover whether mankind has a future among the stars.",
  "genre": ["Sci-Fi", "Adventure"],
  "language": "English",
  "durationMinutes": 169,
  "posterUrl": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  "rating": 8.7
}
```
Alternatively, use the admin seed endpoint only if you add one yourself; it is intentionally not exposed in this starter.

## API routes
- `GET /api/health` — API status
- `GET /api/movies` — list movies; optional `?search=...`
- `POST /api/auth/register` — `{ "name": "...", "email": "...", "password": "..." }`
- `POST /api/auth/login` — `{ "email": "...", "password": "..." }`
- `GET /api/bookings/my` — authenticated user's bookings
- `POST /api/bookings` — authenticated booking; body `{ "movieId": "...", "showDate": "2026-11-01", "showTime": "19:30", "seats": ["A1","A2"] }`

## GitHub upload
From the project root:
```bash
git init
git add .
git commit -m "Initial IMovies MERN project"
```
Create an empty repository on GitHub named `imovies-mern`, then connect it:
```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/imovies-mern.git
git push -u origin main
```
Replace `YOUR-USERNAME` with your GitHub username. Never commit `.env`, passwords, tokens, or database credentials.
