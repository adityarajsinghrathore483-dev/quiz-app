# Current Affairs Quiz App

A full-stack quiz application built with **React + Vite + Tailwind CSS** (frontend), **Node.js + Express** (backend), and **MongoDB** (database).

## 🚀 Features
- ✅ Login with Name, Email, Mobile
- ✅ 30 current affairs questions (one at a time)
- ✅ Timer (60 seconds per question) with warning state
- ✅ Navigation controls + question selection panel
- ✅ Auto-save progress and persist on refresh
- ✅ Submit results and view score breakdown
- ✅ Responsive UI, animations, and modern look

---

## 📁 Project Structure

```
quiz-app01/
├── backend/              # Node/Express API + MongoDB models
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   └── server.js
├── frontend/             # React + Vite + Tailwind UI
│   ├── src/
│   ├── public/
│   └── .env.example
└── README.md
```

---

## 🧰 Setup (Local Development)

### 1) Backend

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`) and update the MongoDB connection string:
   ```bash
   cp .env.example .env
   ```

4. Seed the questions and start the server:
   ```bash
   npm run seed
   npm run dev
   ```

### 2) Frontend

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`) and update the API base URL if needed:
   ```bash
   cp .env.example .env
   ```

4. Start the frontend dev server:
   ```bash
   npm run dev
   ```

---

## ✅ Deployment Guide

✅ **Backend (Render)**
- Create a new Web Service
- Connect to GitHub repo
- Set build command: `npm install && npm run seed`
- Set start command: `npm start`
- Add environment variables: `MONGODB_URI`, `FRONTEND_URL` (your Vercel URL), etc.

✅ **Frontend (Vercel)**
- Create a new Vercel project (connect GitHub repo)
- Set framework preset to **Vite**.
- Set environment variables: `VITE_API_BASE_URL` (your Render backend URL + `/api`)

---

## 🗄️ Database

- **Users** collection stores: `name`, `email`, `mobile`, `score`, `completedAt`
- **Questions** collection stores: `question`, `optionA`-`optionD`, and `correctAnswer`

---

## 🧪 API Endpoints

- `POST /api/login` — login/register a user
- `GET /api/questions` — get list of quiz questions
- `POST /api/submit` — submit answers and calculate score
- `GET /api/results/:userId` — fetch user results

---

## 🎯 Notes
- Quiz progress is saved in `localStorage` to prevent loss on refresh
- Timer auto-submits the quiz at the end of the last question
- The app is built to be mobile-friendly and production-ready
