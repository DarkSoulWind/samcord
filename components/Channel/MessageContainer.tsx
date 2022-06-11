import React, { FC, MutableRefObject, useState } from "react";
import { FaHashtag, FaCuttlefish } from "react-icons/fa";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase-config";
import { Message as MessageModel } from "../../models/Message";
import { User } from "firebase/auth";

import Message from "./Message";
import DateSeparator from "./DateSeparator";

interface MessageContainerProps {
	channelName: string;
	user: User | null | undefined;
	scrollToBottomRef: MutableRefObject<any>;
}

const roots = ["the police", "Harry Azaan"];

const LoadingAnimation: FC = () => {
	return (
		<div className="absolute w-full h-full overflow-hidden flex justify-center items-center">
			<div className="flex flex-col items-center">
				<FaCuttlefish className="w-24 h-24 animate-spin m-3 fill-discord-200" />
				<div className="font-3xl text-discord-200">
					<strong>Loading...</strong>
				</div>
			</div>
		</div>
	);
};

const MessageContainer: FC<MessageContainerProps> = (
	props: MessageContainerProps
) => {
	const [showAmount, setShowAmount] = useState(20);
	const messagesRef = collection(db, "messages");
	const messageQuery = query(
		messagesRef,
		orderBy("date", "desc"),
		limit(showAmount)
	);
	const [messagesResult, loading, error] = useCollection(messageQuery, {
		snapshotListenOptions: { includeMetadataChanges: true },
	});
	const messages = messagesResult?.docs
		.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))
		.reverse() as MessageModel[];

	return (
		<div className="h-[95%] flex flex-col justify-start overflow-y-scroll overflow-x-clip mb-2 scrollbar">
			{loading && <LoadingAnimation />}

			{/* SHOW MORE MESSAGES BUTTON */}
			{showAmount <= messages?.length && (
				<div className="flex justify-center -bottom-10 z-10 overflow-hidden">
					<button
						className="absolute min-w-[80%] md:min-w-[90%] lg:min-w-[95%] rounded-b-md bg-discord-200"
						onClick={() => {
							setShowAmount(showAmount + 5);
						}}
					>
						<div className="flex justify-between text-xs px-2 py-1">
							<div>Show more messages</div>
							<div className="font-bold">Mark as Read</div>
						</div>
					</button>
				</div>
			)}

			{!loading && (
				<div className="mt-auto text-left pt-3">
					<div className="flex-col">
						<div className="flex ml-3 items-center justify-center rounded-full w-16 h-16 mb-2 bg-discord-150">
							<FaHashtag className="w-8 h-8 fill-white" />
						</div>
						<div className="ml-3 font-extrabold text-3xl mb-1">
							Welcome to #{props.channelName}
						</div>
						<div className="ml-3 text-sm text-discord-100 mb-5">
							This is the start of the #{props.channelName}{" "}
							channel
						</div>
					</div>
				</div>
			)}

			{!loading &&
				messages?.map((message, i) => (
					<div key={message.id}>
						{messages[i - 1]?.date.toDate().getDate() !=
							message.date.toDate().getDate() && (
							<DateSeparator
								key={message.id + "a"}
								date={message.date.toDate()}
							/>
						)}
						<Message
							key={message.id}
							id={message.id}
							belongsToCurrentUser={
								props.user?.displayName === message.username ||
								roots.includes(
									props.user?.displayName as string
								)
							}
							date={message.date.toDate()}
							pfp={message.pfp}
							username={message.username}
							text={message.text}
							imageURL={message.imageURL}
							imageName={message.imageName}
						/>
					</div>
				))}
			{/* SCROLL TO BOTTOM */}
			<div ref={props.scrollToBottomRef}></div>
		</div>
	);
};

export default MessageContainer;
