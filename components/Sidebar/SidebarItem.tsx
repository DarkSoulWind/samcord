import React, { FC } from "react";
import { IconType } from "react-icons";

interface SidebarItemProps {
	icon: IconType;
	tooltipMessage: string;
	last?: boolean;
	onClick?: () => void;
}

const SidebarItem: FC<SidebarItemProps> = (props: SidebarItemProps) => {
	return (
		<div
			className={`bg-discord-400 ${
				props.last ? "mt-auto" : ""
			} group flex items-center text-discord-100 justify-center w-12 h-12 rounded-full hover:rounded-2xl hover:bg-discord-200 transition-all`}
			onClick={props.onClick}
		>
			{/* ICON */}
			<props.icon className="w-7 h-7 fill-discord-100" />

			{/* TOOLTIP */}
			<div className="absolute left-[4.5rem] bg-discord-800 p-2 text-sm font-bold scale-0 rounded-md group-hover:scale-100 transition-all">
				{props.tooltipMessage}
			</div>

			{/* LITTLE WHITE THING ON THE LEFT THAT EXPANDS */}
			<div className="absolute -left-[0.85rem] px-2 py-3 bg-white rounded-md scale-0 group-hover:scale-100 transition-all ease-in-out"></div>
		</div>
	);
};

export default SidebarItem;
