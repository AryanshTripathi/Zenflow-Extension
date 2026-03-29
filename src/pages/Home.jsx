import React from "react";
import QuickLinks from "../components/QuickLinks";
import EmbedTab from "../components/EmbedTab";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Calendar from "../components/Calendar";
import Notes from "../components/Notes";
import Sidebar from "../components/Sidebar";

const Home = () => {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<div className="w-screen min-h-screen lg:h-screen overflow-hidden flex flex-col lg:flex-row bg-white">
				{/* Sidebar Component */}
				<Sidebar />

				{/* Main Content Grid */}
				<div className="flex-1 min-h-0 overflow-y-auto lg:overflow-y-hidden">
					<div className="w-full h-full p-2 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[1.25fr_1.6fr] auto-rows-min">
						{/* QuickLinks */}
						<div className="h-full border-2 bg-[#0E0E0E] rounded-lg p-2 text-white overflow-hidden min-h-[300px] lg:min-h-0">
							<QuickLinks />
						</div>
						{/* Calendar */}
						<div className="h-full border-2 bg-[#0E0E0E] rounded-lg text-white p-2 overflow-auto min-h-[350px] lg:min-h-0">
							<Calendar />
						</div>
						{/* Notes: Spans 2 rows on Desktop */}
						<div className="h-full border-2 bg-[#0E0E0E] rounded-lg text-white overflow-hidden lg:row-span-2 lg:col-start-3 min-h-[500px] lg:min-h-0">
							<Notes />
						</div>
						{/* EmbedTab: Spans 2 cols on Desktop */}
						<div className="h-full border-2 bg-[#0E0E0E] rounded-lg overflow-hidden lg:col-span-2 lg:row-start-2 min-h-[500px] lg:min-h-0">
							<EmbedTab />
						</div>
					</div>
				</div>
			</div>
		</QueryClientProvider>
	);
};

export default Home;
