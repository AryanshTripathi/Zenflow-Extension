import React, { useState, useEffect, useCallback } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdAdd, MdSave, MdDelete } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";
import { FaEquals } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import { tasksRepo } from "../repositories/TasksRepository";

const STATUS_CONFIG = {
	not_started: { label: "Not Started", className: "border-red-500 bg-red-50 text-red-700", dotColor: "bg-red-500", next: "in_progress" },
	in_progress: { label: "In Progress", className: "border-yellow-500 bg-yellow-50 text-yellow-700", dotColor: "bg-yellow-500", next: "completed" },
	completed: { label: "Completed", className: "border-green-500 bg-green-50 text-green-700", dotColor: "bg-green-500", next: "not_started" },
};

const PRIORITY_CONFIG = {
	high: { icon: FaAngleDoubleUp, className: "border-red-500 bg-red-50 text-red-700", iconColor: "text-red-500", next: "low" },
	medium: { icon: FaEquals, className: "border-green-500 bg-green-50 text-green-700", iconColor: "text-green-500", next: "high" },
	low: { icon: FaAngleDoubleDown, className: "border-blue-500 bg-blue-50 text-blue-700", iconColor: "text-blue-500", next: "medium" },
};

/**
 * Calculate days remaining until due date
 * @param {Date|string} dueDate - The due date
 * @returns {number} Days remaining (negative if overdue)
 */
const getDaysRemaining = (dueDate) => {
	const today = new Date();
	const due = new Date(dueDate);

	today.setHours(0, 0, 0, 0);
	due.setHours(0, 0, 0, 0);

	const diffTime = due - today;
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	return diffDays;
};

/**
 * Create a new task object with defaults
 */
const createNewTask = (formData) => ({
	id: uuidv4(),
	task_name: formData.name,
	task_type: formData.type,
	task_status: formData.status || "not_started",
	task_priority: formData.priority || "medium",
	due_date: formData.due ? new Date(formData.due) : new Date(),
	createdAt: new Date(),
	updatedAt: new Date(),
});

const useTasks = () => {
	const [tasks, setTasks] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load from repository on mount
	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedTasks = await tasksRepo.getTasks();
				if (fetchedTasks !== null) {
					setTasks(fetchedTasks);
				} else {
					// For new users, we can start with empty or some defaults if we had them
					setTasks([]);
				}
			} catch (error) {
				console.error("Failed to load tasks from repository:", error);
				setTasks([]);
			} finally {
				setIsLoaded(true);
			}
		};
		loadData();
	}, []);

	// Save to repository when tasks change
	useEffect(() => {
		if (!isLoaded) return;
		tasksRepo.setTasks(tasks).catch(console.error);
	}, [tasks, isLoaded]);

	const addTask = useCallback((formData) => {
		const newTask = createNewTask(formData);
		setTasks((prev) => [newTask, ...prev]);
	}, []);

	const updateTask = useCallback((taskId, formData) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === taskId
					? {
							...task,
							task_name: formData.name,
							task_type: formData.type,
							task_status: formData.status || task.task_status,
							task_priority: formData.priority || task.task_priority,
							due_date: formData.due ? new Date(formData.due) : task.due_date,
							updatedAt: new Date(),
					  }
					: task
			)
		);
	}, []);

	const deleteTask = useCallback((taskId) => {
		setTasks((prev) => prev.filter((task) => task.id !== taskId));
		tasksRepo.deleteTask(taskId).catch(console.error);
	}, []);

	const updateTaskStatus = useCallback((taskId, newStatus) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === taskId
					? { ...task, task_status: newStatus, updatedAt: new Date() }
					: task
			)
		);
	}, []);

	const updateTaskPriority = useCallback((taskId, newPriority) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === taskId
					? { ...task, task_priority: newPriority, updatedAt: new Date() }
					: task
			)
		);
	}, []);

	return {
		tasks,
		addTask,
		updateTask,
		deleteTask,
		updateTaskStatus,
		updateTaskPriority,
	};
};

const Status = React.memo(({ taskStatus, taskId, onStatusChange }) => {
	const current = STATUS_CONFIG[taskStatus] || STATUS_CONFIG.not_started;

	const handleClick = (e) => {
		e.stopPropagation();
		onStatusChange(taskId, current.next);
	};

	return (
		<div
			onClick={handleClick}
			className={`hover:cursor-pointer flex items-center gap-2 border-1 rounded-xl w-fit px-3 py-[2px] text-sm font-semibold transition-colors ${current.className}`}>
			<span className={`w-[10px] h-[10px] rounded-full ${current.dotColor}`}></span>
			<span className="capitalize">{current.label}</span>
		</div>
	);
});

const Priority = React.memo(({ taskPriority, taskId, onPriorityChange }) => {
	const current = PRIORITY_CONFIG[taskPriority] || PRIORITY_CONFIG.medium;
	const Icon = current.icon;

	const handleClick = (e) => {
		e.stopPropagation();
		onPriorityChange(taskId, current.next);
	};

	return (
		<div
			onClick={handleClick}
			className={`hover:cursor-pointer flex items-center gap-2 border-1 rounded-xl w-fit px-3 py-[2px] text-sm font-semibold transition-colors ${current.className}`}>
			<Icon className={current.iconColor} />
			<span className="uppercase">{taskPriority}</span>
		</div>
	);
});

const TaskForm = React.memo(({ title, initialData, onSubmit, onCancel, onDelete }) => {
	const [formData, setFormData] = useState({
		name: initialData.task_name || "",
		type: initialData.task_type || "",
		status: initialData.task_status || "",
		priority: initialData.task_priority ? initialData.task_priority.toLowerCase() : "",
		due: initialData.due_date
			? new Date(initialData.due_date).toISOString().split("T")[0]
			: "",
	});

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
	};

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex justify-center items-center z-40">
			<form
				onSubmit={handleSubmit}
				className="bg-white text-black w-full max-w-md mx-auto p-6 border rounded-xl shadow-lg space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-bold">{title}</h2>
					<IoMdCloseCircleOutline
						className="text-2xl font-bold hover:cursor-pointer"
						onClick={onCancel}
					/>
				</div>

				{/* Task Name */}
				<div className="space-y-1">
					<Label htmlFor="name" className="mb-1 pl-[4px] py-0.5">
						Name
					</Label>
					<Input
						className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0 shadow-none"
						id="name"
						name="name"
						placeholder="Enter task name"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>

				{/* Task Type */}
				<div className="space-y-1">
					<Label htmlFor="type" className="mb-1 pl-[4px] py-0.5">
						Type
					</Label>
					<Input
						className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0 shadow-none"
						id="type"
						name="type"
						placeholder="e.g. Development, Fitness"
						value={formData.type}
						onChange={handleChange}
					/>
				</div>

				{/* Status */}
				<div className="space-y-1">
					<Label htmlFor="status" className="mb-1 pl-[4px] py-0.5">
						Status
					</Label>
					<select
						id="status"
						name="status"
						value={formData.status}
						onChange={handleChange}
						className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-0 shadow-none">
						<option value="">Select status</option>
						<option value="not_started">Not Started</option>
						<option value="in_progress">In Progress</option>
						<option value="completed">Completed</option>
					</select>
				</div>

				{/* Priority */}
				<div className="space-y-1">
					<Label htmlFor="priority" className="mb-1 pl-[4px] py-0.5">
						Priority
					</Label>
					<select
						id="priority"
						name="priority"
						value={formData.priority}
						onChange={handleChange}
						className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-0 shadow-none">
						<option value="">Select priority</option>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
				</div>

				{/* Due Date */}
				<div className="space-y-1">
					<Label htmlFor="due" className="mb-1 pl-[4px] py-0.5">
						Due Date
					</Label>
					<Input
						className="w-full focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-offset-0 shadow-none"
						id="due"
						name="due"
						type="date"
						value={formData.due}
						onChange={handleChange}
					/>
				</div>

				{/* Buttons */}
				<div className="flex items-center justify-between gap-4">
					<Button type="submit" className={`mt-3 ${onDelete ? "w-[48%]" : "w-full"} hover:cursor-pointer flex items-center justify-center gap-2`}>
						{title === "Add Task" ? <MdAdd className="text-xl" /> : <MdSave className="text-lg" />}
						{title}
					</Button>
					{onDelete && (
						<Button
							type="button"
							onClick={onDelete}
							className="mt-3 w-[48%] bg-red-500 hover:bg-red-600 hover:cursor-pointer flex items-center justify-center gap-2">
							<MdDelete className="text-lg" />
							Delete Task
						</Button>
					)}
				</div>
			</form>
		</div>
	);
});

// --- Main Component ---

const Tasks = ({ openAddTaskForm, setOpenAddTaskForm }) => {
	const {
		tasks,
		addTask,
		updateTask,
		deleteTask,
		updateTaskStatus,
		updateTaskPriority,
	} = useTasks();

	const [selectedTask, setSelectedTask] = useState(null);

	const handleAddTask = useCallback(
		(formData) => {
			addTask(formData);
			setOpenAddTaskForm(false);
		},
		[addTask, setOpenAddTaskForm]
	);

	const handleUpdateTask = useCallback(
		(formData) => {
			if (selectedTask) {
				updateTask(selectedTask.id, formData);
				setSelectedTask(null);
			}
		},
		[selectedTask, updateTask]
	);

	const handleDeleteTask = useCallback(() => {
		if (selectedTask) {
			deleteTask(selectedTask.id);
			setSelectedTask(null);
		}
	}, [selectedTask, deleteTask]);

	return (
		<div className="w-full h-full px-5 pt-6 flex flex-col">
			<div className="w-full flex-1 overflow-auto">
				<div className="min-w-[800px]">
					<div className="font-semibold h-[30px] max-h-[30px] min-h-[30px] grid grid-cols-28 pb-2 px-3 sticky top-0 bg-black z-30 text-gray-100">
						<div className="col-span-8">Name</div>
						<div className="col-span-6">Type</div>
						<div className="col-span-5">Status</div>
						<div className="col-span-5">Priority</div>
						<div className="col-span-4 text-end">Clockdown</div>
					</div>
					<div className="pb-3">
						{tasks.map((task) => (
							<div
								className={`grid grid-cols-28 mt-2 capitalize rounded-xl px-3 py-2 hover:bg-[#0a0a0a] hover:shadow-sm hover:shadow-gray-900 transition duration-300 cursor-pointer`}
								key={task.id}>
								<div className="col-span-8" onClick={() => setSelectedTask(task)}>
									{task.task_name}
								</div>
								<div className="col-span-6">{task.task_type}</div>
								<div className="col-span-5">
									<Status
										taskStatus={task.task_status.toLowerCase()}
										taskId={task.id}
										onStatusChange={updateTaskStatus}
									/>
								</div>
								<div className="col-span-5">
									<Priority
										taskPriority={task.task_priority.toLowerCase()}
										taskId={task.id}
										onPriorityChange={updateTaskPriority}
									/>
								</div>
								<div className="col-span-4 text-end">
									{getDaysRemaining(task.due_date) > 0
										? `${getDaysRemaining(task.due_date)} Days`
										: "Overdue"}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			{openAddTaskForm && (
				<TaskForm
					title="Add Task"
					initialData={{}}
					onSubmit={handleAddTask}
					onCancel={() => setOpenAddTaskForm(false)}
				/>
			)}
			{selectedTask && (
				<TaskForm
					title="Update Task"
					initialData={selectedTask}
					onSubmit={handleUpdateTask}
					onDelete={handleDeleteTask}
					onCancel={() => setSelectedTask(null)}
				/>
			)}
		</div>
	);
};

export default Tasks;
