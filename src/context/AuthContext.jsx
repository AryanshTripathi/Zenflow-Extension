import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signInWithCredential, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

const AuthContext = createContext({});

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	console.log("AuthProvider Initializing...");

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			console.log("Auth state changed. User:", user ? user.uid : "null");
			if (user) {
				console.log("User authenticated.");
				setUser(user);
			} else {
				console.log("User unauthenticated.");
				setUser(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const loginWithGoogle = async () => {
		try {
			// If it's actually running inside a Chrome extension
			if (typeof chrome !== "undefined" && chrome.identity) {
				await new Promise((resolve, reject) => {
					chrome.identity.getAuthToken({ interactive: true }, async (token) => {
					if (chrome.runtime.lastError || !token) {
						reject(chrome.runtime.lastError || "No token received");
						return;
					}
					const credential = GoogleAuthProvider.credential(null, token);
					console.log("Google Login Result (Extension):", credential);
					const result = await signInWithCredential(auth, credential);
					console.log("Google Login Result (Extension):", result);
					resolve(result.user);
					});
				});
			} else {
			// Fallback for normal web environments
			const result = await signInWithPopup(auth, googleProvider);
			console.log("Google Login Result (Web):", result);
			return result.user;
			}
		} catch (error) {
			console.error("Error signing in with Google:", error);
			throw error;
		}
	};


	// const loginWithGoogle = async () => {
	// 	try {
	// 		const result = await signInWithPopup(auth, googleProvider);
	// 		console.log("Google Login Result:", result);
	// 		return result.user;
	// 	} catch (error) {
	// 		console.error("Error signing in with Google:", error);
	// 		throw error;
	// 	}
	// };

	const signupWithEmail = async (email, password, username) => {
		try {
			const result = await createUserWithEmailAndPassword(auth, email, password);
			await updateProfile(result.user, { displayName: username });
			console.log("Email Signup Result:", result.user.uid, "with Username:", username);
			return result.user;
		} catch (error) {
			console.error("Error signing up with email:", error);
			throw error;
		}
	};

	const loginWithEmail = async (email, password) => {
		try {
			const result = await signInWithEmailAndPassword(auth, email, password);
			console.log("Email Login Result:", result.user.uid);
			return result.user;
		} catch (error) {
			console.error("Error logging in with email:", error);
			throw error;
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Error signing out:", error);
			throw error;
		}
	};

	const value = {
		user,
		loading,
		loginWithGoogle,
		loginWithEmail,
		signupWithEmail,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
