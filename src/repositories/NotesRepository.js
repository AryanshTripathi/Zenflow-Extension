import { db, auth } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { convertTimestamps } from "@/lib/utils";

const STORAGE_KEY = "zenflow_notes_data";

/**
 * Notes Repository - Cache-first with Firestore sync
 */
class NotesRepository {
	constructor() {
		this.collectionName = "notes";
	}

	getCollectionRef() {
		const user = auth.currentUser;
		if (!user) throw new Error("User not authenticated");
		return collection(db, `${this.collectionName}/${user.uid}/items`);
	}

	getUserStorageKey() {
		const user = auth.currentUser;
		return user ? `${user.uid}_${STORAGE_KEY}` : STORAGE_KEY;
	}

	async getNotes() {
		const storageKey = this.getUserStorageKey();
		const local = localStorage.getItem(storageKey);

		if (local !== null) {
			// Background refresh
			this.refreshFromFirestore().catch(console.error);
			const parsedNotes = JSON.parse(local);
			return convertTimestamps(parsedNotes);
		}

		// No cache? Fallback to Firestore
		const firebaseData = await this.fetchFromFirestore();
		if (firebaseData && firebaseData.length > 0) {
			localStorage.setItem(storageKey, JSON.stringify(firebaseData));
			return convertTimestamps(firebaseData);
		}

		// Signal "uninitialized" to use defaults
		return null;
	}

	async setNotes(notes) {
		const storageKey = this.getUserStorageKey();
		localStorage.setItem(storageKey, JSON.stringify(notes));

		// Async push to Firestore
		try {
			const collectionRef = this.getCollectionRef();
			const promises = notes.map((note) => {
				const docRef = doc(collectionRef, note.id.toString());
				return setDoc(docRef, note, { merge: true });
			});
			await Promise.all(promises);
		} catch (error) {
			console.error("Failed to sync notes to Firestore:", error);
		}
	}

	async deleteNote(id) {
		const storageKey = this.getUserStorageKey();
		const local = JSON.parse(localStorage.getItem(storageKey)) || [];
		const updated = local.filter((n) => n.id !== id);
		localStorage.setItem(storageKey, JSON.stringify(updated));

		// Delete from Firestore
		try {
			const collectionRef = this.getCollectionRef();
			const docRef = doc(collectionRef, id.toString());
			await deleteDoc(docRef);
		} catch (error) {
			console.error("Failed to delete note from Firestore:", error);
		}
	}

	async fetchFromFirestore() {
		try {
			const collectionRef = this.getCollectionRef();
			const snapshot = await getDocs(collectionRef);
			return snapshot.docs.map((doc) => doc.data());
		} catch (error) {
			console.error("Failed to fetch notes from Firestore:", error);
			return [];
		}
	}

	async refreshFromFirestore() {
		try {
			const fresh = await this.fetchFromFirestore();
			const storageKey = this.getUserStorageKey();
			// Sanitize before storing
			localStorage.setItem(storageKey, JSON.stringify(convertTimestamps(fresh)));
		} catch (err) {
			console.log("Firestore refresh failed for notes:", err);
		}
	}
}

export const notesRepo = new NotesRepository();
