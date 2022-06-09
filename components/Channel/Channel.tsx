import React, { FC } from "react";
import { FaHashtag, FaPaperPlane } from "react-icons/fa";
import MessageContainer from "./MessageContainer";

interface ChannelProps {
	name: string;
}

const Channel: FC<ChannelProps> = (props: ChannelProps) => {
	return (
		<div className="ml-16 py-2 flex flex-col h-screen text-white">
			{/* Channel name */}
			<div className="w-full flex gap-1 justify-start items-center border-b-[1px] pb-2 border-b-discord-700">
				<FaHashtag className="w-4 h-4 fill-discord-100 ml-3" />
				<div className="font-bold text-sm">{props.name}</div>
			</div>

			<MessageContainer channelName={props.name} />

			{/* Text input box */}
			<form
				className="mt-auto px-3 flex"
				autoComplete="off"
				autoCapitalize="off"
				spellCheck="false"
			>
				<input
					className="mt-auto text-white placeholder:text-opacity-0 w-[95%] mr-2 mb-2 outline-none rounded-md bg-discord-300 py-3 px-4 text-xs"
					type="text"
					placeholder="Message @urmum"
				/>
				<button
					type="submit"
					className="w-10 h-10 group-scope bg-discord-200 rounded-full flex justify-center items-center"
				>
					<FaPaperPlane className="w-5 h-5 fill-white group-scope-active:opacity-60 transition-all ease-in" />
				</button>
			</form>
		</div>
	);
};

export default Channel;
