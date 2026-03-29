import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const LoginPopup = () => {
	const { loginWithEmail, signupWithEmail } = useAuth();
	const [error, setError] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const [isSignup, setIsSignup] = React.useState(false);
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [username, setUsername] = React.useState("");

	console.log("LoginPopup")

	const handleAuth = async (e) => {
		e.preventDefault();
		if (!email || !password || (isSignup && !username)) {
			setError("Please fill in all fields.");
			return;
		}
		try {
			setError(null);
			setLoading(true);
			if (isSignup) {
				await signupWithEmail(email, password, username);
			} else {
				await loginWithEmail(email, password);
			}
		} catch (err) {
			setError(err.message || "Failed to authenticate");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
			<div className="bg-white text-black w-full max-w-md mx-auto p-8 border rounded-xl shadow-2xl space-y-6">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold">Welcome to ZenFlow</h1>
					<p className="text-gray-600">
						{isSignup ? "Create an account to continue" : "Sign in to your account to continue"}
					</p>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleAuth} className="space-y-4">
					{isSignup && (
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Username</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
								placeholder="zenflow_user"
								required={isSignup}
							/>
						</div>
					)}
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Email Address</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
							placeholder="admin@zenflow.com"
							required
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
							placeholder="••••••••"
							required
						/>
					</div>
					<Button
						type="submit"
						disabled={loading}
						className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors hover:cursor-pointer">
						{loading ? "Processing..." : (isSignup ? "Sign Up" : "Sign In")}
					</Button>
				</form>

				<div className="text-center">
					<button
						onClick={() => {
							setIsSignup(!isSignup);
							setError(null);
						}}
						className="text-blue-600 hover:underline text-sm font-medium cursor-pointer">
						{isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
					</button>
				</div>

				<p className="text-xs text-gray-500 text-center">
					By signing in, you agree to our Terms of Service and Privacy Policy
				</p>
			</div>
		</div>
	);
};

export default LoginPopup;
