import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSwipeable } from "react-swipeable";
import { MdAdd, MdSave, MdDelete } from "react-icons/md";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import ToolTip from "./Tooltip";
import { IoMdCloseCircleOutline, IoMdClose } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { quickLinksRepo } from "../repositories/QuickLinksRepository";

// --- Constants ---

const DEFAULT_LINKS = []

// --- Helper Functions ---

/**
 * Get favicon URL from external API
 * @param {string} url - The website URL
 * @returns {string} Favicon URL
 */
const getFaviconFromAPI = (url) => {
	try {
		const domain = new URL(url).hostname;
		return `https://www.google.com/s2/favicons?sz=256&domain=${domain}`;
	} catch (error) {
		console.error("Invalid URL for favicon:", url, error);
		return "";
	}
};

/**
 * Extract unique categories from links
 * @param {Array} links - Array of link objects
 * @returns {Array} Array of unique category names
 */
const extractCategories = (links) => {
	const uniqueCategories = [...new Set(links.map((link) => link.category))];
	return uniqueCategories.filter(Boolean); // Remove any null/undefined
};

/**
 * Categorize links by category
 * @param {Array} links - Array of link objects
 * @returns {Object} Object with category names as keys and link arrays as values
 */
const categorizeLinks = (links) => {
	const result = {};

	links.forEach((link) => {
		if (!result[link.category]) {
			result[link.category] = [];
		}
		result[link.category].push(link);
	});

	return result;
};

// --- Custom Hook: useQuickLinks ---

const useQuickLinks = () => {
	const [links, setLinks] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load from repository on mount
	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedLinks = await quickLinksRepo.getLinks();
				
				if (fetchedLinks !== null) {
					setLinks(fetchedLinks);
				} else {
					setLinks(DEFAULT_LINKS);
				}
			} catch (error) {
				console.error("Failed to load QuickLinks from repository:", error);
				setLinks(DEFAULT_LINKS);
			} finally {
				setIsLoaded(true);
			}
		};
		loadData();
	}, []);

	// Sync to repository whenever data changes (after initial load)
	useEffect(() => {
		if (!isLoaded) return;
		quickLinksRepo.setLinks(links).catch(console.error);
	}, [links, isLoaded]);

	// Derive categories from links
	const categories = useMemo(() => extractCategories(links), [links]);

	const addLink = useCallback((formData) => {
		const newLink = {
			id: uuidv4(),
			link_url: formData.url,
			link_name: formData.name,
			category: formData.category,
		};

		setLinks((prev) => [newLink, ...prev]);
	}, []);

	const updateLink = useCallback((linkId, formData) => {
		setLinks((prev) =>
			prev.map((link) =>
				link.id === linkId
					? {
							...link,
							link_url: formData.url,
							link_name: formData.name,
							category: formData.category,
					  }
					: link
			)
		);
	}, []);

	const deleteLink = useCallback((linkId) => {
		setLinks((prev) => prev.filter((link) => link.id !== linkId));
		// Also delete from Firestore
		quickLinksRepo.deleteLink(linkId).catch(console.error);
	}, []);

	const updateDefaultCategory = useCallback((categoryName) => {
		setDefaultCategory(categoryName);
	}, []);

	return {
		links,
		categories,
		isLoaded,
		addLink,
		updateLink,
		deleteLink,
	};
};

// --- Sub-Components ---

const QuickLinkForm = React.memo(({ title, showForm, initialData, onClose, onSubmit, onDelete }) => {
	const [formData, setFormData] = useState({
		name: initialData?.link_name || "",
		url: initialData?.link_url || "",
		category: initialData?.category || "",
	});

	// Update form when initialData changes
	useEffect(() => {
		if (initialData) {
			setFormData({
				name: initialData.link_name || "",
				url: initialData.link_url || "",
				category: initialData.category || "",
			});
		}
	}, [initialData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
		setFormData({ name: "", url: "", category: "" });
		onClose();
	};

	if (!showForm) return null;

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex justify-center items-center z-40">
			<form
				onSubmit={handleSubmit}
				className="bg-white text-black w-full max-w-md mx-auto p-6 border rounded-xl shadow-lg space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-bold">{title}</h2>
					<IoMdCloseCircleOutline
						className="text-2xl font-bold hover:cursor-pointer"
						onClick={onClose}
					/>
				</div>

				<div className="space-y-1">
					<Label htmlFor="name" className="mb-1 pl-[4px] py-0.5">
						Name
					</Label>
					<Input
						className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0 shadow-none"
						id="name"
						name="name"
						placeholder="Enter link name"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="space-y-1">
					<Label htmlFor="url" className="mb-1 pl-[4px] py-0.5">
						URL
					</Label>
					<Input
						className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0 shadow-none"
						id="url"
						name="url"
						type="url"
						placeholder="https://example.com"
						value={formData.url}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="space-y-1">
					<Label htmlFor="category" className="mb-1 pl-[4px] py-0.5">
						Category
					</Label>
					<Input
						className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0 shadow-none"
						id="category"
						name="category"
						placeholder="Enter category"
						value={formData.category}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="flex items-center justify-between gap-4">
					<Button 
						type="submit" 
						className={`mt-3 ${onDelete ? "w-[48%]" : "w-full"} hover:cursor-pointer flex items-center justify-center gap-2`}>
						{title === "Add Quick Link" ? <MdAdd className="text-xl" /> : <MdSave className="text-lg" />}
						{title}
					</Button>
					{onDelete && (
						<Button
							type="button"
							onClick={onDelete}
							className="mt-3 w-[48%] bg-red-500 hover:bg-red-600 hover:cursor-pointer flex items-center justify-center gap-2">
							<MdDelete className="text-lg" />
							Delete Link
						</Button>
					)}
				</div>
			</form>
		</div>
	);
});

// --- Main Component ---

const QuickLinks = () => {
	const { links, categories, defaultCategory, isLoaded, addLink, updateLink, deleteLink, updateDefaultCategory } = useQuickLinks();
	const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
	const [showAddLinkForm, setShowAddLinkForm] = useState(false);
	const [selectedLink, setSelectedLink] = useState(null);

	// Initialize current category index
	useEffect(() => {
		if (categories.length > 0) {
			setCurrentCategoryIndex(0);
		}
	}, [categories.length]);

	const currentCategory = categories[currentCategoryIndex] || "";

	const categorizedLinks = useMemo(
		() => categorizeLinks(links),
		[links]
	);

	const handleLeftClick = useCallback(() => {
		if (categories.length === 0) return;
		setCurrentCategoryIndex((prev) => {
			const newIndex = prev - 1;
			return newIndex < 0 ? categories.length - 1 : newIndex;
		});
	}, [categories.length]);

	const handleRightClick = useCallback(() => {
		if (categories.length === 0) return;
		setCurrentCategoryIndex((prev) => {
			const newIndex = prev + 1;
			return newIndex >= categories.length ? 0 : newIndex;
		});
	}, [categories.length]);

	const handleAddLink = useCallback(
		(formData) => {
			addLink(formData);
		},
		[addLink]
	);

	const handleUpdateLink = useCallback(
		(formData) => {
			if (selectedLink) {
				updateLink(selectedLink.id, formData);
				setSelectedLink(null);
			}
		},
		[selectedLink, updateLink]
	);

	const handleDeleteLink = useCallback(() => {
		if (selectedLink) {
			deleteLink(selectedLink.id);
			setSelectedLink(null);
		}
	}, [selectedLink, deleteLink]);

	const handlers = useSwipeable({
		onSwipedLeft: handleRightClick,
		onSwipedRight: handleLeftClick,
		preventScrollOnSwipe: true,
		trackTouch: true,
		trackMouse: true,
	});

	if (!isLoaded) {
		return <div className="h-full flex items-center justify-center">Loading Links...</div>;
	}

	return (
		<div className="h-full">
			<div className="flex justify-between items-center px-4 h-[15%]">
				<div className="text-2xl font-bold">Quick Links</div>
				<ToolTip description="Add a quick link">
					<div className="flex items-start border-2 border-gray-500 rounded-md hover:cursor-pointer">
						<MdAdd
							color="white"
							className="font-bold text-3xl"
							onClick={() => setShowAddLinkForm(true)}
						/>
					</div>
				</ToolTip>
			</div>

			<div {...handlers} className="relative h-[74%]">
				<div className="flex flex-wrap justify-start items-start gap-[10px] pt-[18px] px-[16px]">
					{categorizedLinks[currentCategory]?.map((link) => (
						<div
							className="relative group w-[60px] h-[70px] mb-3"
							key={link.id}>
							{/* Hover Delete Button */}
							<div
								className="absolute -top-1 -right-1 hidden group-hover:flex bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 items-center justify-center cursor-pointer shadow-lg z-30 transition-all duration-200 transform hover:scale-110"
								onClick={(e) => {
									e.stopPropagation();
									deleteLink(link.id);
								}}
								title="Delete Link">
								<IoMdClose size={14} />
							</div>

							<div
								className="hover:cursor-pointer flex flex-col items-center"
								onClick={() => window.open(link.link_url)}
								onContextMenu={(e) => {
									e.preventDefault();
									setSelectedLink(link);
								}}>
								<div className="rounded-lg bg-gray-400 p-2 w-[50px] h-[50px] flex items-center justify-center">
									<img
										src={getFaviconFromAPI(link.link_url)}
										alt={link.link_name}
										className="h-full w-full aspect-square object-contain"
									/>
								</div>
								<div className="w-[50px] text-xs text-center truncate mt-1">
									{link.link_name}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="sticky flex justify-between items-center px-2 mt-2">
				<FaAngleDoubleLeft
					className="hover:cursor-pointer"
					onClick={handleLeftClick}
				/>
				<div
					className="uppercase font-semibold text-center hover:cursor-default">
					{currentCategory}
				</div>
				<FaAngleDoubleRight
					className="hover:cursor-pointer"
					onClick={handleRightClick}
				/>
			</div>

			<QuickLinkForm
				title="Add Quick Link"
				showForm={showAddLinkForm}
				initialData={null}
				onClose={() => setShowAddLinkForm(false)}
				onSubmit={handleAddLink}
			/>

			<QuickLinkForm
				title="Edit Quick Link"
				showForm={selectedLink !== null}
				initialData={selectedLink}
				onClose={() => setSelectedLink(null)}
				onSubmit={handleUpdateLink}
				onDelete={handleDeleteLink}
			/>
		</div>
	);
};

export default QuickLinks;
