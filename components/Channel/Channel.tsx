import { User } from "firebase/auth";
import React, { FC, useState } from "react";
import { FaHashtag, FaPaperPlane } from "react-icons/fa";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { CensorSensor } from "censor-sensor";

import MessageContainer from "./MessageContainer";

interface ChannelProps {
	name: string;
	user: User | null | undefined;
}

const Channel: FC<ChannelProps> = (props: ChannelProps) => {
	const [textInput, setTextInput] = useState("");
	const messagesRef = collection(db, "messages");
	const censor = new CensorSensor();

	const submitMessage = async () => {
		if (textInput.trim() === "") return;
		setTextInput("");

		const data = {
			date: Timestamp.now(),
			pfp: props.user?.photoURL,
			username: props.user?.displayName,
			text: censor.cleanProfanity(textInput),
		};

		await addDoc(messagesRef, data);
	};

	return (
		<div className="ml-16 py-2 flex flex-col h-screen text-white overflow-hidden">
			{/* Channel name */}
			<div className="w-full flex gap-1 justify-start items-center border-b-[1px] pb-2 border-b-discord-700">
				<FaHashtag className="w-4 h-4 fill-discord-100 ml-3" />
				<div className="font-bold text-sm">{props.name}</div>
			</div>

			<MessageContainer channelName={props.name} user={props.user} />

			{/* Text input box */}
			<form
				className="mt-auto px-3 w-full flex"
				autoComplete="off"
				autoCapitalize="off"
				spellCheck="false"
				onSubmit={(e) => {
					e.preventDefault();
					if (!props.user) return;
					submitMessage();
				}}
			>
				<input
					className="mt-auto text-white placeholder:text-opacity-0 w-full mr-2 mb-2 outline-none rounded-md bg-discord-300 py-3 px-4 text-xs"
					type="text"
					placeholder={
						props.user
							? `Message #${props.name}`
							: "You must be logged in to send messages"
					}
					value={textInput}
					onChange={(e) => {
						setTextInput(e.target.value);
					}}
					disabled={!props.user}
				/>
				<button
					type="submit"
					className={`${
						props.user ? "block" : "hidden"
					} w-10 h-10 aspect-square bg-discord-200 rounded-full flex justify-center items-center`}
					disabled={!props.user}
				>
					<FaPaperPlane className="w-5 h-5 fill-white active:opacity-50 transition-all ease-in" />
				</button>
			</form>
		</div>
	);
};

export default Channel;
