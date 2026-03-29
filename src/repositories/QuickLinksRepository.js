import { db, auth } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { convertTimestamps } from "@/lib/utils";

const STORAGE_KEY_LINKS = "zenflow_quicklinks_data";

/**
 * QuickLinks Repository - Cache-first with Firestore sync
 */
class QuickLinksRepository {
	constructor() {
		this.collectionName = "quicklinks";
	}

	getCollectionRef() {
		const user = auth.currentUser;
		console.log("User authenticated:", user ? user.uid : "null");
		if (!user) throw new Error("User not authenticated");
		return collection(db, `${this.collectionName}/${user.uid}/items`);
	}

	getUserStorageKey(key) {
		const user = auth.currentUser;
		return user ? `${user.uid}_${key}` : key;
	}

	// READ (cache first)
	async getLinks() {
		const storageKey = this.getUserStorageKey(STORAGE_KEY_LINKS);
		const local = localStorage.getItem(storageKey);
		console.log("Local storage data:", local);

		if (local !== null) {
			// Background refresh
			this.refreshFromFirestore().catch(console.error);
			return convertTimestamps(JSON.parse(local));
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

	async setLinks(links) {
		const storageKey = this.getUserStorageKey(STORAGE_KEY_LINKS);
		localStorage.setItem(storageKey, JSON.stringify(links));

		// Async push to Firestore (non-blocking)
		try {
			const collectionRef = this.getCollectionRef();
			const promises = links.map((link) => {
				const docRef = doc(collectionRef, link.id);
				return setDoc(docRef, link, { merge: true });
			});
			await Promise.all(promises);
		} catch (error) {
			console.error("Failed to sync links to Firestore:", error);
		}
	}

	async deleteLink(id) {
		const storageKey = this.getUserStorageKey(STORAGE_KEY_LINKS);
		const local = JSON.parse(localStorage.getItem(storageKey)) || [];
		const updated = local.filter((l) => l.id !== id);
		localStorage.setItem(storageKey, JSON.stringify(updated));

		// Delete from Firestore
		try {
			const collectionRef = this.getCollectionRef();
			const docRef = doc(collectionRef, id);
			await deleteDoc(docRef);
		} catch (error) {
			console.error("Failed to delete link from Firestore:", error);
		}
	}

	async fetchFromFirestore() {
		try {
			const collectionRef = this.getCollectionRef();
			console.log("Collection reference:", collectionRef);
			const snapshot = await getDocs(collectionRef);
			console.log("Firestore snapshot data:", snapshot.docs.map((doc) => doc.data()));
			return snapshot.docs.map((doc) => doc.data());
		} catch (error) {
			console.error("Failed to fetch from Firestore:", error);
			return [];
		}
	}

	async refreshFromFirestore() {
		try {
			const fresh = await this.fetchFromFirestore();
			const storageKey = this.getUserStorageKey(STORAGE_KEY_LINKS);
			localStorage.setItem(storageKey, JSON.stringify(convertTimestamps(fresh)));
		} catch (err) {
			console.log("Firestore refresh failed, but UI still lives:", err);
		}
	}
}

export const quickLinksRepo = new QuickLinksRepository();
