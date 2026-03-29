import React, { useState, useEffect, useCallback, useMemo } from "react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import {
	MdAdd,
	MdDelete,
	MdChevronLeft,
	MdChevronRight,
} from "react-icons/md";
import { format } from "date-fns";
import ToolTip from "./Tooltip";
import { notesRepo } from "../repositories/NotesRepository";
import { ensureDate } from "@/lib/utils";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";

// --- Constants & Helpers ---

const STORAGE_KEY = "zenflow_notes_data";

/**
 * Helper to safely extract a title string from a BlockNote block structure.
 * @param {Object} note - The note object.
 * @returns {string} The derived title.
 */
const getNoteTitle = (note) => {
	const firstBlock = note.content && note.content[0];
	if (!firstBlock) return "Untitled";

	const content = firstBlock.content;
	if (typeof content === "string") return content || "Untitled";
	if (Array.isArray(content)) {
		return content.map((c) => c.text).join("") || "Untitled";
	}
	return "Untitled";
};

/**
 * Creates a new default note object.
 */
const createInitialNote = () => ({
	id: Date.now(),
	content: [
		{
			type: "heading",
			content: "New Note",
		},
	],
	createdAt: new Date(),
});

// --- Custom Hook: useNotes ---

const useNotes = () => {
	const [notes, setNotes] = useState([]);
	const [activeNoteId, setActiveNoteId] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load from repository on mount
	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedNotes = await notesRepo.getNotes();
				if (fetchedNotes !== null) {
					setNotes(fetchedNotes);
					if (fetchedNotes.length > 0) {
						setActiveNoteId(fetchedNotes[0].id);
					}
				} else {
					// Default content if storage is empty
					const welcomeNote = createInitialNote();
					welcomeNote.id = 1; // Explicit ID for welcome note
					welcomeNote.content = [
						{ type: "heading", content: "Welcome to Notes" },
						{
							type: "paragraph",
							content: "This is your first note. Click 'Add Note' to create more.",
						},
					];
					setNotes([welcomeNote]);
					setActiveNoteId(welcomeNote.id);
				}
			} catch (error) {
				console.error("Failed to load notes from repository:", error);
				setNotes([]);
			} finally {
				setIsLoaded(true);
			}
		};
		loadData();
	}, []);

	// Sync to repository whenever notes change
	useEffect(() => {
		if (!isLoaded) return;
		notesRepo.setNotes(notes).catch(console.error);
	}, [notes, isLoaded]);

	const addNote = useCallback(() => {
		const newNote = createInitialNote();
		setNotes((prev) => [...prev, newNote]);
		setActiveNoteId(newNote.id);
	}, []);

	const updateNote = useCallback(
		(content) => {
			setNotes((prev) =>
				prev.map((n) => (n.id === activeNoteId ? { ...n, content } : n))
			);
		},
		[activeNoteId]
	);

	const deleteNote = useCallback(
		(noteId) => {
			setNotes((prev) => {
				const newNotes = prev.filter((n) => n.id !== noteId);
				if (activeNoteId === noteId) {
					setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null);
				}
				return newNotes;
			});
			notesRepo.deleteNote(noteId).catch(console.error);
		},
		[activeNoteId]
	);

	return {
		notes,
		activeNoteId,
		setActiveNoteId,
		addNote,
		updateNote,
		deleteNote,
	};
};

// --- Sub-Components ---

const NoteSidebar = React.memo(
	({
		notes,
		activeNoteId,
		onSelectNote,
		onDeleteNote,
		onAddNote,
		isOpen,
		toggleOpen,
	}) => {
		console.log(notes);
		console.log(activeNoteId);
		return (
			<div
				className={`${
					isOpen ? "w-56 min-w-[14rem]" : "w-16 min-w-[4rem]"
				} flex-none border-r border-gray-800 p-4 flex flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out`}>
				{/* Header */}
				<div
					className={`flex ${
						isOpen ? "justify-between" : "justify-center"
					} items-center gap-2 transition-all`}>
					{isOpen && <div className="text-2xl font-bold">Notes</div>}
					<div
						className={`flex ${
							isOpen ? "flex-row" : "flex-col-reverse"
						} gap-1 items-center`}>
						<button
							onClick={toggleOpen}
							className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
							aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}>
							{isOpen ? (
								<MdChevronLeft className="text-2xl" />
							) : (
								<MdChevronRight className="text-2xl" />
							)}
						</button>
						<button
							onClick={onAddNote}
							className="p-2 rounded-full hover:bg-gray-800 transition-colors"
							title="Add Note">
							<MdAdd className="text-2xl" />
						</button>
					</div>
				</div>

				{/* Note List */}
				<div className="flex flex-col gap-2 overflow-y-auto">
					{notes.map((note) => (
						<div
							key={note.id}
							onClick={() => onSelectNote(note.id)}
							className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
								activeNoteId === note.id ? "bg-gray-800" : "hover:bg-gray-900"
							} ${!isOpen && "flex justify-center"}`}
							role="button"
							tabIndex={0}>
							{isOpen ? (
								<>
									<div className="font-semibold truncate pr-6">
										{getNoteTitle(note)}
									</div>
									<div className="text-xs text-gray-400 mt-1">
										{format(ensureDate(note.createdAt) || new Date(), "MMM d, yyyy h:mm a")}
									</div>
									<button
										onClick={(e) => {
											e.stopPropagation();
											onDeleteNote(note.id);
										}}
										className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
										aria-label="Delete note">
										<MdDelete className="text-lg" />
									</button>
								</>
							) : (
								<ToolTip description={getNoteTitle(note)}>
									<div className="w-2 h-2 rounded-full bg-gray-500 group-hover:bg-white transition-colors" />
								</ToolTip>
							)}
						</div>
					))}
				</div>
			</div>
		);
	}
);

const NoteEditor = React.memo(({ initialContent, onUpdate, onFocus }) => {
	const editor = useCreateBlockNote({
		initialContent: initialContent,
	});

	return (
		<div className="h-full flex flex-col" onFocus={onFocus} onClick={onFocus}>
			<BlockNoteView
				editor={editor}
				onChange={() => {
					onUpdate(editor.document);
				}}
				theme={"dark"}
				className="flex-1 overflow-y-auto p-4"
			/>
		</div>
	);
});

// --- Main Component ---

const Notes = () => {
	const {
		notes,
		activeNoteId,
		setActiveNoteId,
		addNote,
		updateNote,
		deleteNote,
	} = useNotes();

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [noteToDelete, setNoteToDelete] = useState(null);
	const [toast, setToast] = useState({ isVisible: false, message: "" });

	const activeNote = useMemo(
		() => notes.find((n) => n.id === activeNoteId),
		[notes, activeNoteId]
	);

	const handleDeleteConfirm = useCallback(() => {
		if (noteToDelete) {
			deleteNote(noteToDelete);
			setNoteToDelete(null);
			setToast({ isVisible: true, message: "Note deleted successfully!" });
		}
	}, [noteToDelete, deleteNote]);

	// Update the deleteNote logic to just set state for modal
	// (Note: we'll keep the actual deletion logic in the hook, but trigger the modal here)
	const triggerDelete = useCallback((id) => {
		setNoteToDelete(id);
	}, []);

	const toggleSidebar = useCallback(() => {
		setIsSidebarOpen((prev) => !prev);
	}, []);

	const closeSidebar = useCallback(() => {
		setIsSidebarOpen(false);
	}, []);

	return (
		<div className="w-full h-full text-white flex overflow-hidden">
			<NoteSidebar
				notes={notes}
				activeNoteId={activeNoteId}
				onSelectNote={setActiveNoteId}
				onDeleteNote={triggerDelete}
				onAddNote={addNote}
				isOpen={isSidebarOpen}
				toggleOpen={toggleSidebar}
			/>

			{/* Editor Area */}
			<div className="flex-1 bg-[#1F1F1F] min-w-0 overflow-hidden flex flex-col">
				{activeNote ? (
					<>
						{/* Note Header */}
						<div className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
							<h2 className="text-xl font-semibold truncate text-gray-200">
								{getNoteTitle(activeNote)}
							</h2>
							<button
								onClick={() => triggerDelete(activeNote.id)}
								className="p-2 rounded-full hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-all duration-300"
								title="Delete Note">
								<MdDelete className="text-2xl" />
							</button>
						</div>

						{/* Editor */}
						<div className="flex-1 overflow-hidden">
							<NoteEditor
								key={activeNote.id}
								initialContent={activeNote.content}
								onUpdate={updateNote}
								onFocus={closeSidebar}
							/>
						</div>
					</>
				) : (
					<div className="h-full flex items-center justify-center text-gray-500">
						Select a note to view
					</div>
				)}
			</div>

			<ConfirmModal
				isOpen={!!noteToDelete}
				onClose={() => setNoteToDelete(null)}
				onConfirm={handleDeleteConfirm}
				title="Delete Note"
				message="Are you sure you want to delete this note? This cannot be undone."
				confirmText="Delete"
			/>

			<Toast
				isVisible={toast.isVisible}
				message={toast.message}
				onClose={() => setToast({ ...toast, isVisible: false })}
			/>
		</div>
	);
};

export default Notes;
