import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

/**
 * Ensures a value is a valid Date object or null.
 * Handles ISO strings, Firestore Timestamps, and Number/Date inputs.
 */
export function ensureDate(value) {
	if (!value) return null;

	// Firestore Timestamp
	if (typeof value === "object" && value.seconds !== undefined) {
		return new Date(value.seconds * 1000 + (value.nanoseconds || 0) / 1000000);
	}

	const date = new Date(value);
	return isNaN(date.getTime()) ? null : date;
}

/**
 * Deeply searches an object/array and converts likely date fields/Firestore Timestamps to Date objects.
 */
export function convertTimestamps(obj) {
	if (!obj || typeof obj !== "object") return obj;

	if (Array.isArray(obj)) {
		return obj.map(convertTimestamps);
	}

	// Firestore Timestamp check
	if (obj.seconds !== undefined && obj.nanoseconds !== undefined) {
		return ensureDate(obj);
	}

	const newObj = {};
	for (const [key, value] of Object.entries(obj)) {
		// Heuristic: fields ending in 'At' or 'Date' or containing 'due' are likely dates
		if (
			(key.toLowerCase().endsWith("at") ||
				key.toLowerCase().endsWith("date") ||
				key.toLowerCase().includes("due")) &&
			value
		) {
			newObj[key] = ensureDate(value);
		} else if (typeof value === "object" && value !== null) {
			newObj[key] = convertTimestamps(value);
		} else {
			newObj[key] = value;
		}
	}
	return newObj;
}
