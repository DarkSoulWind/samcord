import React, { FC } from "react";
import { FaHashtag } from "react-icons/fa";
import Message from "./Message";

interface MessageContainerProps {
	channelName: string;
}

const MessageContainer: FC<MessageContainerProps> = (
	props: MessageContainerProps
) => {
	return (
		<div className="h-[95%] flex flex-col justify-start overflow-y-scroll mb-2 scrollbar">
			{/* Welcome message */}
			<div className="mt-auto text-left pt-3">
				<div className="flex-col">
					<div className="flex ml-3 items-center justify-center rounded-full w-16 h-16 mb-2 bg-discord-150">
						<FaHashtag className="w-8 h-8 fill-white" />
					</div>
					<div className="ml-3 font-extrabold text-3xl mb-1">
						Welcome to #{props.channelName}
					</div>
					<div className="ml-3 text-sm text-discord-100 mb-5">
						This is the start of the #{props.channelName} channel.
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

			<Message
				date={new Date(Date.now())}
				pfp="https://samsoongcord.netlify.app/assets/images/pfp.png"
				username="SAM_SOONG"
				text="Hi"
			/>
		</div>
	);
};

export default MessageContainer;
