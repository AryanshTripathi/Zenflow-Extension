# 🌊 Zenflow

**An all-in-one personal productivity workspace — tasks, notes, quick links, and a calendar in a single, dynamic new-tab experience.**

Zenflow is a browser extension-style productivity web app that replaces your new tab with a beautiful, dark-themed dashboard. Organize your day without ever leaving your browser.

---

## ✨ Features

### ✅ Daily Tasks
Create, prioritize, and track your daily to-dos. Tasks support priorities, statuses, and inline editing — all synced in real-time to your account via Firebase.

### 📝 Rich-Text Notes
A Notion-like editor powered by **BlockNote** with block-level editing, Markdown support, multiple notes, timestamps, and sidebar navigation. Notes are saved per-user and persist across sessions.

### 🔗 Quick Links
Pin your most-visited URLs for instant one-click access. Manage, reorder, and delete links effortlessly from the dashboard.

### 📅 Calendar
An integrated calendar view to keep dates and schedules in view at all times.

### 🔐 Firebase Authentication
Secure sign-up and login with support for **Email + Username**. All user data is scoped and persisted per account.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 19, Vite, TailwindCSS v4 | React's component model scales well for a multi-panel dashboard; Vite provides near-instant HMR; TailwindCSS v4 enables rapid, consistent styling without leaving JSX |
| Rich-Text Editor | BlockNote | Delivers a Notion-like block-based editing experience out of the box, with Markdown support and extensibility, without the complexity of building a custom editor |
| Auth & Database | Firebase (Auth + Firestore) | Provides a battle-tested, serverless backend — no custom API needed. Firestore's real-time sync keeps all panels up-to-date across sessions |
| Data Fetching | TanStack React Query | Manages server state, caching, and background refetching cleanly — especially important for keeping task and notes data in sync without manual loading state management |
| Date Utilities | date-fns, moment | date-fns is used for lightweight, tree-shakeable date formatting; moment handles legacy parsing where needed |

---

## 🗺️ Roadmap

Planned features for upcoming releases:

- **⌨️ Keyboard Shortcuts** — Power-user shortcuts for creating tasks, switching panels, and navigating notes without touching the mouse.
- **✨ Animations & Transitions** — Polished micro-animations for panel interactions, task completions, and note transitions to elevate the overall feel.
- **🔗 Calendar ↔ Tasks Integration** — Link tasks directly to calendar dates so deadlines appear on the calendar and calendar events can generate tasks automatically.
- **🔁 Recurring Tasks** — Support for daily, weekly, and custom-interval recurring tasks that auto-regenerate on schedule.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Firebase project

### Installation

```bash
git clone https://github.com/AryanshTripathi/Zenflow-Extension.git
cd Zenflow-Extension/client/zenflow
npm install
```

### Configure Firebase

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📄 License

MIT License
