import { db, auth } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { convertTimestamps } from "@/lib/utils";

const STORAGE_KEY = "zenflow_tasks_data";

/**
 * Tasks Repository - Cache-first with Firestore sync
 */
class TasksRepository {
	constructor() {
		this.collectionName = "tasks";
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

	async getTasks() {
		const storageKey = this.getUserStorageKey();
		const local = localStorage.getItem(storageKey);

		if (local !== null) {
			// Background refresh
			this.refreshFromFirestore().catch(console.error);
			const parsedTasks = JSON.parse(local);
			return convertTimestamps(parsedTasks);
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

	async setTasks(tasks) {
		const storageKey = this.getUserStorageKey();
		localStorage.setItem(storageKey, JSON.stringify(tasks));

		// Async push to Firestore
		try {
			const collectionRef = this.getCollectionRef();
			const promises = tasks.map((task) => {
				const docRef = doc(collectionRef, task.id);
				return setDoc(docRef, task, { merge: true });
			});
			await Promise.all(promises);
		} catch (error) {
			console.error("Failed to sync tasks to Firestore:", error);
		}
	}

	async deleteTask(id) {
		const storageKey = this.getUserStorageKey();
		const local = JSON.parse(localStorage.getItem(storageKey)) || [];
		const updated = local.filter((t) => t.id !== id);
		localStorage.setItem(storageKey, JSON.stringify(updated));

		// Delete from Firestore
		try {
			const collectionRef = this.getCollectionRef();
			const docRef = doc(collectionRef, id);
			await deleteDoc(docRef);
		} catch (error) {
			console.error("Failed to delete task from Firestore:", error);
		}
	}

	async fetchFromFirestore() {
		try {
			const collectionRef = this.getCollectionRef();
			const snapshot = await getDocs(collectionRef);
			return snapshot.docs.map((doc) => doc.data());
		} catch (error) {
			console.error("Failed to fetch tasks from Firestore:", error);
			return [];
		}
	}

	async refreshFromFirestore() {
		try {
			const fresh = await this.fetchFromFirestore();
			const storageKey = this.getUserStorageKey();
			localStorage.setItem(storageKey, JSON.stringify(convertTimestamps(fresh)));
		} catch (err) {
			console.log("Firestore refresh failed for tasks:", err);
		}
	}
}

export const tasksRepo = new TasksRepository();
