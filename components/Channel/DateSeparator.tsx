import React, { FC } from "react";

interface DateSeparatorProps {
	date: Date;
}

const DateSeparator: FC<DateSeparatorProps> = (props: DateSeparatorProps) => {
	return (
		<div className="flex justify-center mt-5 mb-6">
			<div className="w-[97%] border-b-2 border-discord-300">
				<div className="relative flex justify-center">
					<div className="text-center hover:cursor-default absolute -bottom-[0.6rem] text-discord-100 text-xs font-bold bg-discord-500 px-1">
						{props.date.getDate()}{" "}
						{props.date.toLocaleString("en-us", {
							month: "long",
							year: "numeric",
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DateSeparator;
