# Backend - Current Affairs Quiz App

This is the backend API server for the Current Affairs Quiz App.

## 🚀 Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

- `MONGODB_URI`: Your MongoDB connection string (Atlas or local)
- `FRONTEND_URL`: Frontend URL for CORS (e.g., `http://localhost:5173`)

### 3. Seed questions

This will populate the `questions` collection with 30 current affairs questions:

```bash
npm run seed
```

### 4. Start the server

```bash
npm run dev
```

The API will be available at `http://localhost:5000` (or the port defined in `.env`).

## 🧩 API Endpoints

### POST `/api/login`
- Body: `{ name, email, mobile }`
- Creates or updates a user. Returns user object.

### GET `/api/questions`
- Returns the list of quiz questions (without correct answers).

### POST `/api/submit`
- Body: `{ userId, answers }` where `answers` is an object mapping questionId -> selected option.
- Calculates score and returns the result.

### GET `/api/results/:userId`
- Returns the user record with score and completedAt.

## 🛠️ Notes
- Database models are built with Mongoose
- Questions are seeded with current affairs content
- The server includes simple error handling and CORS support
