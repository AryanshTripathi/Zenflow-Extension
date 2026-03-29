import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import ToolTip from "./Tooltip";
import Tasks from "./Tasks";

const EmbedTab = () => {
	const [activeTab, setActiveTab] = useState("todos");
	const [openAddGoalForm, setOpenAddGoalForm] = useState(false);
	const [openAddTaskForm, setOpenAddTaskForm] = useState(false);

	const handleOpenForm = () => {
		if (activeTab.toLowerCase() == "goals") {
			setOpenAddGoalForm(true);
		} else if (activeTab.toLowerCase() == "todos") {
			setOpenAddTaskForm(true);
		}
	};

	return (
		<div className="w-full h-full bg-black p-4 text-white">
			<div className="w-full h-[40px] text-xl font-semibold flex items-end justify-start gap-6 border-b-1 border-gray-400 relative">
				<div
					className={`pb-1 ${
						activeTab.toLowerCase() == "todos"
							? "border-white"
							: "border-transparent"
					} hover:cursor-pointer pb-1 capitalize`}
					onClick={() => setActiveTab("todos")}>
					Daily Tasks
				</div>
				<div className="absolute right-2">
					<ToolTip
						description={`Create a ${
							activeTab == "goals" ? "Goal" : "Daily Task"
						}`}>
						<div
							className="flex items-start border-2 border-gray-500 rounded-md hover:cursor-pointer"
							onClick={handleOpenForm}>
							<MdAdd color="white" className="font-bold text-3xl" />
						</div>
					</ToolTip>
				</div>
			</div>
			<div className="w-full h-[calc(100%-40px)]">
				{activeTab.toLowerCase() == "todos" && (
					<Tasks
						openAddTaskForm={openAddTaskForm}
						setOpenAddTaskForm={setOpenAddTaskForm}
					/>
				)}
			</div>
		</div>
	);
};

export default EmbedTab;
