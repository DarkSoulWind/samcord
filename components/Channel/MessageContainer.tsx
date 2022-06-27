import React, {
	FC,
	MutableRefObject,
	useState,
	Dispatch,
	SetStateAction,
	useEffect,
} from "react";
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
	setViewingImage: Dispatch<SetStateAction<string>>;
}

const roots = ["the police", "Harry Azaan"];

const LoadingAnimation: FC = () => {
	return (
		<div className="fixed w-full h-full overflow-hidden flex justify-center items-center">
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
	const [notes, setNotes] = useState<{ [key: string]: string }>({});

	// FETCHING MESSAGES
	const showMore = 20;
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

	useEffect(() => {
		setNotes(JSON.parse(localStorage.getItem("samcord-notes") || "{}"));
		console.log(error);
	}, []);

	return (
		<div className="h-full flex flex-col justify-start overflow-y-scroll overflow-x-clip scrollbar">
			{/* SHOW THE LOADING ANIMATION WHILE MESSAGESE ARE LOADING */}
			{error && <LoadingAnimation />}

			{loading && <LoadingAnimation />}

			{/* SHOW MORE MESSAGES BUTTON */}
			{showAmount <= messages?.length && (
				<div className="flex justify-center z-10 overflow-hidden">
					<div className="fixed w-full top-[2.2rem] min-w-[300px] px-12">
						<button
							className=" min-w-full rounded-b-md bg-discord-200"
							onClick={() => {
								setShowAmount(showAmount + showMore);
							}}
						>
							<div className="flex justify-between text-xs px-2 py-1">
								<div>Show more messages</div>
								<div className="font-bold">Mark as Read</div>
							</div>
						</button>
					</div>
				</div>
			)}

			{/* WELCOME TO CHANNEL MESSAGE */}
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

			{/* DISPLAY ALL MESSAGES */}
			{!loading &&
				messages?.map((message, i) => (
					<div key={message.id}>
						{/* SHOW THE DATE SEPARATOR ON A NEW DAY */}
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
							setViewingImage={props.setViewingImage}
							notes={notes}
							setNotes={setNotes}
						/>
					</div>
				))}
			{/* SCROLL TO BOTTOM */}
			<div className="" ref={props.scrollToBottomRef}></div>
		</div>
	);
};

export default MessageContainer;
