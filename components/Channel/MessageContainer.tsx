import React, { FC } from "react";
import { FaHashtag, FaCuttlefish } from "react-icons/fa";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase-config";
import { Message as MessageModel } from "../../models/Message";
import Message from "./Message";

interface MessageContainerProps {
	channelName: string;
}

const LoadingAnimation: FC = () => {
	return (
		<div className="absolute w-screen h-screen overflow-hidden flex justify-center items-center">
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
	const messagesRef = collection(db, "messages");
	const messageQuery = query(messagesRef, orderBy("date"), limit(25));
	const [messagesResult, loading, error] = useCollection(messageQuery, {
		snapshotListenOptions: { includeMetadataChanges: true },
	});
	const messages = messagesResult?.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	})) as MessageModel[];

	return (
		<div className="h-[95%] flex flex-col justify-start overflow-y-scroll overflow-x-clip mb-2 scrollbar">
			{loading && <LoadingAnimation />}

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
						<div className="flex justify-center mb-3">
							<div className="w-[97%] border-b-2 border-discord-300">
								<div className="relative flex justify-center">
									<div className="text-center hover:cursor-default absolute -bottom-[0.6rem] text-discord-100 text-xs font-bold bg-discord-500 px-1">
										{new Date().getDate()}{" "}
										{new Date().toLocaleString("en-us", {
											month: "long",
											year: "numeric",
										})}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{!loading &&
				messages?.map((message) => (
					<Message
						key={message.id}
						date={message.date.toDate()}
						pfp={message.pfp}
						username={message.username}
						text={message.text}
					/>
				))}
		</div>
	);
};

export default MessageContainer;
