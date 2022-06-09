import { User } from "firebase/auth";
import React, { Dispatch, FC, SetStateAction } from "react";
import Image from "next/image";
import { FaFish, FaCog, FaLink } from "react-icons/fa";

import SidebarItem from "./SidebarItem";

interface SidebarProps {
	showLogin: boolean;
	setShowLogin: Dispatch<SetStateAction<boolean>>;
	user: User | null | undefined;
}

const Sidebar: FC<SidebarProps> = (props: SidebarProps) => {
	return (
		<div className="fixed top-0 left-0 bg-discord-700 p-2 w-16 h-screen">
			<div className="flex flex-col gap-2 pb-4 justify-start items-center last:mt-auto h-screen">
				<div>
					<SidebarItem icon={FaFish} tooltipMessage="samcord" />
				</div>
				<div
					onClick={() =>
						window.open(
							"https://linktree-clone.harryazaan.repl.co/",
							"_blank"
						)
					}
				>
					<SidebarItem icon={FaLink} tooltipMessage="socials" />
				</div>

				{!props.user && (
					<SidebarItem
						icon={FaCog}
						tooltipMessage={props.user ? "Logout" : "Login"}
						onClick={() => {
							props.setShowLogin(true);
						}}
						last
					/>
				)}
				{props.user && (
					<div className="mt-auto">
						<Image
							className="mt-auto rounded-full hover:opacity-60 transition-all"
							width="100%"
							height="100%"
							src={props.user?.photoURL as string}
							onClick={() => {
								props.setShowLogin(true);
							}}
						/>
						<div className="relative">
							<div className="absolute -right-1 bottom-0 w-6 h-6 border-[4px] border-discord-700 rounded-full bg-green-500"></div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
