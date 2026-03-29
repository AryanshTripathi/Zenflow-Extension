import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const Calendar = () => {
	return (
		<div className="w-full h-full text-white overflow-auto">
			<DayPicker mode="single" showOutsideDays className="w-full" />
		</div>
	);
};

export default Calendar;
