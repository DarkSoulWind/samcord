import React, { FC, Dispatch, SetStateAction } from "react";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { db } from "../../firebase-config";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../firebase-config";

interface MessageProps {
	id: string;
	belongsToCurrentUser: boolean;
	date: Date;
	pfp: string;
	username: string;
	text: string;
	imageURL: string | null;
	imageName: string | null;
	setViewingImage: Dispatch<SetStateAction<string>>;
}

const Message: FC<MessageProps> = (props: MessageProps) => {
	// parse date into hours and minutes
	let dateString = `${props.date.getHours()}:${
		props.date.getMinutes().toLocaleString().length < 2 ? "0" : ""
	}${props.date.getMinutes()}`;

	const deleteMessage = async () => {
		const messageRef = doc(db, "messages", props.id);
		if (props.imageURL) {
			const imageRef = ref(storage, `images/${props.imageName}`);
			await deleteObject(imageRef);
			console.log(`Deleted image: ${props.imageName}`);
		}
		await deleteDoc(messageRef).then(() => {
			console.log("Message deleted successfully.");
		});
	};

	return (
		<div className="flex w-full justify-start group hover:bg-discord-600 text-white text-sm py-1 mb-1">
			{/* PFP */}
			<div className="mx-3">
				<div className="relative z-0 w-12 h-12">
					<Image
						className="rounded-full aspect-square group-hover:cursor-pointer"
						alt={props.username}
						loading="lazy"
						src={props.pfp}
						width="100%"
						height="100%"
					/>
				</div>
			</div>

			{/* MESSAGE DATA */}
			<div className="w-11/12 flex flex-col justify-start gap-0 mr-4">
				<div className="pr-4">
					<span className="font-bold hover:cursor-pointer hover:underline">
						{props.username}
					</span>{" "}
					<span className="text-[0.6rem] text-discord-100">
						{new Date().getDate() == props.date.getDate()
							? "Today"
							: `${props.date.getDate()}/${
									props.date.getMonth() + 1
							  }/${props.date.getFullYear()}`}{" "}
						at {dateString}
					</span>
					<div>{props.text}</div>
				</div>

				{/* IMAGE ATTACHMENT */}
				{props.imageURL && (
					<div
						onClick={() =>
							props.setViewingImage(props.imageURL as string)
						}
						className="relative mt-3 hover:cursor-pointer w-full flex flex-start"
					>
						<div className="my-2 xs:my-0 h-80 pr-auto max-h-96">
							<Image
								src={props.imageURL}
								loading="lazy"
								layout="fill"
								objectFit="contain"
							/>
						</div>
					</div>
				)}
			</div>

			{/* SHOW DELETE BUTTON IF THE MESSAGE BELONGS TO CURRENT USER */}
			{props.belongsToCurrentUser && (
				<div className="relative">
					<button className="absolute hidden group-hover:block text-white -top-6 bg-discord-500 hover:bg-discord-300 transition-all border-[1px] border-discord-700 p-1 right-5">
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
