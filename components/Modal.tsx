import React, { Dispatch, FC, SetStateAction, useState } from "react";

interface ModalProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	title: string;
	description: string;
	actionButtonText: string;
	loadingState?: boolean;
	onActionButtonClick: () => void;
}

const Modal: FC<ModalProps> = (props: ModalProps) => {
	return (
		<div
			className={`${
				props.isOpen ? "z-30 bg-opacity-80" : "-z-30 bg-opacity-0"
			} absolute w-screen bg-black h-screen transition-all ease-in-out flex items-center justify-center`}
		>
			<div className={`absolute w-full h-full`}></div>
			<div
				className={`${
					props.isOpen ? "scale-100" : "scale-0"
				} transition-all h-20 flex-col justify-start`}
			>
				<div className="bg-discord-400 p-2 rounded-t-sm w-[20rem]">
					<div className="text-white text-md mb-1 font-bold">
						{props.title}
					</div>
					<div className="text-discord-100 mb-8 text-xs">
						{props.description}
					</div>
				</div>
				<div className="bg-discord-600 rounded-b-sm">
					<div className="flex justify-end gap-5 p-2 text-white text-xs items-center">
						<button
							className="hover:underline"
							onClick={() => props.setIsOpen(false)}
						>
							Cancel
						</button>
						<button
							className={`${
								props.loadingState ? "bg-red-800" : "bg-red-500"
							} hover:bg-red-800 transition-all py-1 px-4 rounded-sm`}
							onClick={() => {
								props.onActionButtonClick();
								props.setIsOpen(false);
							}}
							disabled={props.loadingState}
						>
							{props.loadingState
								? "Loading..."
								: props.actionButtonText}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
