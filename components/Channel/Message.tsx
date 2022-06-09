import React, { FC } from "react";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { db } from "../../firebase-config";
import { doc, deleteDoc } from "firebase/firestore";

interface MessageProps {
	id: string;
	belongsToCurrentUser: boolean;
	date: Date;
	pfp: string;
	username: string;
	text: string;
}

const Message: FC<MessageProps> = (props: MessageProps) => {
	// parse date into hours and minutes
	let dateString = `${props.date.getHours()}:${
		props.date.getMinutes().toLocaleString().length < 2 ? "0" : ""
	}${props.date.getMinutes()}`;

	const deleteMessage = async () => {
		const messageRef = doc(db, "messages", props.id);
		await deleteDoc(messageRef).then(() => {
			console.log("Message deleted successfully.");
		});
	};

	return (
		<div className="flex w-full justify-start group hover:bg-discord-600 text-white text-sm py-1 mb-1">
			{/* PFP */}
			<div className="mx-3">
				<div className="relative w-12 h-12">
					<Image
						className="rounded-full aspect-square group-scope-hover:cursor-pointer"
						alt={props.username}
						loading="lazy"
						src={props.pfp}
						width="100%"
						height="100%"
					/>
				</div>
			</div>

			{/* MESSAGE DATA */}
			<div className="w-11/12 flex flex-col justify-start gap-0">
				<div className="pr-4">
					<span className="font-bold hover:cursor-pointer hover:underline">
						{props.username}
					</span>{" "}
					<span className="text-[0.6rem] text-discord-100">
						Today at {dateString}
					</span>
					<div>{props.text}</div>
				</div>
			</div>

			{/* SHOW DELETE BUTTON IF THE MESSAGE BELONGS TO CURRENT USER */}
			{props.belongsToCurrentUser && (
				<div className="relative">
					<button className="absolute hidden group-hover:block text-white -top-7 bg-discord-500 hover:bg-discord-300 transition-all border-[1px] border-discord-700 p-1 right-5">
						<div className="group-scope" onClick={deleteMessage}>
							<FaTrash className="w-5 h-5 fill-red-600" />
							<div className="absolute -right-3 -top-11 bg-discord-800 p-2 scale-0 group-scope-hover:scale-100 transition-all rounded-md text-sm">
								delete
							</div>
						</div>
					</button>
				</div>
			)}
		</div>
	);
};

export default Message;
