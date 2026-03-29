# 🌊 Zenflow

Zenflow is a comprehensive, personal productivity web application designed to help you organize your daily life. By combining task management, rich-text notes, habits/routines, and easy-access quick links into a single, seamless, and dynamic interface, Zenflow empowers you to stay focused and organized. 

![Zenflow UI Overview](/docs/overview.png) *(Placeholder for screenshot)*

## ✨ Key Features

- **✅ Tasks & Todos**: Manage your daily tasks efficiently. Track task priorities, statuses, and updates.
- **📝 Notion-like Notes**: A powerful rich-text editor (powered by BlockNote) supporting Markdown, block elements, timestamps, and multiple notes.
- **🔄 Habits & Routines**: Track your daily habits and routines with visual timelines and interactive tracking.
- **🔗 QuickLinks**: Save and quickly access your most important URLs and embeds from your workspace.
- **📅 Calendar Integration**: Keep track of events and timelines with an integrated calendar view.
- **🔐 Secure Authentication**: Integrated Firebase Authentication allowing user signups, logins, and personalized data persistence (Email and Username support).
- **🎨 Dynamic & Responsive UI**: Fluid animations and highly responsive interface designed to feel premium, built with Framer Motion, GSAP, TailwindCSS, and Radix UI.

## 🛠️ Technology Stack

- **Frontend**: React 19 (via Vite), TailwindCSS, Radix UI Primitives, Mantine
- **Editor**: BlockNote (for Notion-like note-taking capabilities)
- **Animations**: Framer Motion, GSAP
- **Data & Auth**: Firebase (Authentication & Database)
- **State Management & Fetching**: React Query, Context API
- **Icons**: Lucide React, React Icons
- **Date/Time Parsing**: date-fns, moment

## 🚀 Getting Started

To run the Zenflow application locally, follow these steps:

### Prerequisites
- Node.js (v18+ recommended)
- Firebase Account & Project setup

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/zenflow.git
   cd zenflow/client/zenflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Firebase configuration details:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code issues.

## 🤝 Contributing

Contributions are welcome! If you have suggestions or find issues, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.
