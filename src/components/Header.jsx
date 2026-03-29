import React, { useContext } from "react";
import PageContext from "../context/PageContext";
import { Input } from "../../components/ui/input.jsx";
import { useAuth } from "../context/AuthContext";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "../../components/ui/avatar";

const Header = () => {
	const { page, setPage } = useContext(PageContext);
	const { user } = useAuth();
	const displayName = user?.displayName || "User";

	return (
		<>
			{page == "home" && (
				<div className="w-screen h-[10%] flex justify-between items-center">
					{/* <div className="h-full pt-8 pl-8 w-[30%]">
						<div className="text-3xl pb-2 font-bold overflow-y-hidden">
							Welcome, {user}!
						</div>
						<div className="text-2xl overflow-y-hidden">
							Your personalized workspace
						</div>
					</div> */}
					<div className="flex w-[80%] h-full items-center justify-around">
						<div className="w-[80%] h-full relative">
							<Input
								className="h-[50%] border-gray-300"
								placeholder="Search Tasks"
							/>
							<FaSearch className="absolute right-4 top-[38%]" />
						</div>
					</div>
					<div className="">
						<Avatar className="w-12 h-12 hover:cursor-pointer">
							<AvatarImage src={user?.photoURL} />
							<AvatarFallback>
								{displayName
									.split(" ")
									.map((word) => word[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
					</div>
				</div>
			)}
		</>
	);
};

export default Header;
