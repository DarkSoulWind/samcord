import React, { Dispatch, FC, SetStateAction } from "react";
import { FaFish, FaCog } from "react-icons/fa";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
	showLogin: boolean;
	setShowLogin: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: FC<SidebarProps> = (props: SidebarProps) => {
	return (
		<div className="fixed top-0 left-0 bg-discord-700 p-2 w-16 h-screen">
			<div className="flex flex-col gap-3 pb-4 justify-start items-center last:mt-auto h-screen">
				<SidebarItem icon={FaFish} tooltipMessage="samcord" />
				<SidebarItem
					icon={FaCog}
					tooltipMessage="Settings"
					onClick={() => {
						props.setShowLogin(true);
					}}
					last
				/>
			</div>
		</div>
	);
};

export default Sidebar;
