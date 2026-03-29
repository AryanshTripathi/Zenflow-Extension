import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "../../components/ui/tooltip";
import React from "react";

const ToolTip = ({ description, children }) => {
	return (
		<Tooltip className="custom-tooltip">
			<TooltipTrigger>{children}</TooltipTrigger>
			<TooltipContent className="py-1 h-[30px] flex justify-center items-center">
				{description}
			</TooltipContent>
		</Tooltip>
	);
};

export default ToolTip;
