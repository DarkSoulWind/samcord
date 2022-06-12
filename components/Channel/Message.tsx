import React, { FC, Dispatch, SetStateAction, useState } from "react";
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
	const [note, setNote] = useState("");
	const [showMiniprofile, setShowMiniprofile] = useState(false);
	const [useWidth, setUseWidth] = useState(10);
	const [useHeight, setUseHeight] = useState(10);

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
						onClick={() => setShowMiniprofile(!showMiniprofile)}
						alt={props.username}
						loading="lazy"
						src={props.pfp}
						width="100%"
						height="100%"
					/>
				</div>
				{/* MINI PROFILE */}
				<div
					className={`relative z-20 ${
						showMiniprofile
							? "translate-x-6 opacity-100"
							: "opacity-0 -z-10"
					} transition-all`}
				>
					<div className="absolute -bottom-16 left-10 flex flex-col h-40 w-60">
						<div className="h-1/4 bg-black rounded-t"></div>
						<div className="h-3/4 bg-discord-800 rounded-b px-4">
							<div className="uppercase text-lg font-bold mb-2">
								{props.username}
							</div>
							<div className="flex justify-center w-full mb-1">
								<div className="w-full border-b-[1px] border-discord-500"></div>
							</div>
							<div className="text-[0.7rem] font-extrabold text-discord-100 uppercase">
								note
							</div>
							{/* SAVE NOTES TO LOCALSTORAGE */}
							<textarea
								className="text-white text-xs w-full bg-transparent resize-none focus:bg-discord-700 outline-none rounded-sm"
								placeholder="Click to add a note"
								value={note}
								onChange={(e) => setNote(e.target.value)}
							></textarea>
						</div>
					</div>
				</div>
			</div>

			{/* MESSAGE DATA */}
			<div className="w-11/12 flex flex-col justify-start gap-0 mr-4">
				<div className="pr-4">
					<span
						onClick={() => setShowMiniprofile(!showMiniprofile)}
						className="font-bold hover:cursor-pointer hover:underline"
					>
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
					<div className="relative mt-3 flex flex-start">
						<div className={`overflow-hidden`}>
							<Image
								onClick={() =>
									props.setViewingImage(
										props.imageURL as string
									)
								}
								className="hover:cursor-pointer"
								src={props.imageURL}
								loading="lazy"
								width="200%"
								height={`${200 * (useHeight / useWidth)}%`}
								onLoad={(e) => {
									// get width and height of the image
									const img = e.target as HTMLImageElement;
									const width = img.naturalWidth;
									const height = img.naturalHeight;
									setUseWidth(width);
									setUseHeight(height);
									console.log(useWidth, useHeight);
								}}
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
