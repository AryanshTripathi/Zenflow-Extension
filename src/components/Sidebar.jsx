import React from "react";
import { SiZendesk } from "react-icons/si";
import { useAuth } from "../context/AuthContext";
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "../../components/ui/avatar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../components/ui/popover";
import { MdLogout } from "react-icons/md";

const Sidebar = () => {
	const { user, logout } = useAuth();

	const UserAvatar = () => (
		<Popover>
			<PopoverTrigger asChild>
				<div className="cursor-pointer hover:opacity-80 transition-opacity">
					<Avatar className="h-10 w-10 border-2 border-gray-700">
						<AvatarImage src={user?.photoURL} alt={user?.displayName || "User"} />
						<AvatarFallback className="bg-gray-800 text-white font-bold">
							{user?.displayName?.charAt(0) || "U"}
						</AvatarFallback>
					</Avatar>
				</div>
			</PopoverTrigger>
			<PopoverContent
				side="right"
				align="start"
				className="w-48 bg-[#1A1A1A] border-gray-800 text-white p-2 shadow-2xl ml-2 lg:ml-0">
				<div className="flex flex-col gap-1">
					<div className="px-2 py-1.5 text-sm font-medium text-gray-400 border-b border-gray-800 mb-1">
						{user?.displayName || user?.email}
					</div>
					<button
						onClick={() => logout()}
						className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-red-900/40 hover:text-red-400 rounded-md transition-colors cursor-pointer text-left w-full group">
						<MdLogout className="text-gray-400 group-hover:text-red-400 transition-colors" />
						Logout
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);

	return (
		<>
			{/* Desktop Sidebar - Vertical */}
			<div className="hidden lg:flex flex-col justify-between items-center w-16 h-full bg-[#0E0E0E] border-r-2 border-gray-800 py-6">
				{/* Avatar Icon with Dropdown */}
				<UserAvatar />

				{/* Logo */}
				<div className="cursor-pointer hover:opacity-80 transition-opacity">
					<SiZendesk className="text-white text-3xl" />
				</div>
			</div>

			{/* Mobile Navbar - Horizontal */}
			<div className="flex lg:hidden justify-between items-center w-full h-16 bg-[#0E0E0E] border-b-2 border-gray-800 px-4">
				{/* Avatar Icon with Dropdown */}
				<div className="flex items-center">
					<UserAvatar />
				</div>

				{/* Logo */}
				<div className="cursor-pointer hover:opacity-80 transition-opacity">
					<SiZendesk className="text-white text-3xl" />
				</div>
			</div>
		</>
	);
};

export default Sidebar;
