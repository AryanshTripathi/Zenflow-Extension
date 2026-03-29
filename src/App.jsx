import { useState } from "react";
import PageContext from "./context/PageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPopup from "./components/LoginPopup";
import "./App.css";
import Home from "./pages/Home";

// Protected App Content
const AppContent = () => {
	const { user, loading } = useAuth();
	const [page, setPage] = useState("home");

	if (loading) {
		return (
			<div className="w-screen h-screen flex items-center justify-center bg-[url('/src/assets/login-page-bg.jpg')] bg-cover">
				<div className="text-white text-2xl">Loading...</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="w-screen h-screen flex items-center justify-center bg-[url('/src/assets/login-page-bg.jpg')] bg-cover">
				<LoginPopup />
			</div>
		);
	}

	console.log("AppContent: User authenticated:", user);
	return (
		<PageContext value={{ page: page, setPage: setPage }}>
			{page == "home" && <Home />}
		</PageContext>
	);
};

function App() {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
}

export default App;
