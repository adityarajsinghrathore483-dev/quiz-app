# Frontend - Current Affairs Quiz App

This is the React + Vite + Tailwind frontend for the Current Affairs Quiz App.

## 📦 Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create a `.env` file:

```bash
cp .env.example .env
```

3. Run the dev server:

```bash
npm run dev
```

The app will usually run at `http://localhost:5173`.

## 🔧 Configuration

- `VITE_API_BASE_URL`: URL to the backend API (e.g., `http://localhost:5000/api`).

## 🧠 Tech Highlights

- React Router for page navigation
- LocalStorage persistence to prevent losing progress on refresh
- Timer + progress bar components
- Smooth animations and responsive UI

## 🧩 Usage

1. Login with name, email and mobile number
2. Start the quiz from the dashboard
3. Navigate between questions
4. Submit anytime or wait for auto-submit
5. View results with score and percentage
