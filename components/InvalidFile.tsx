import React, { FC, Dispatch, SetStateAction } from "react";
import { FaFile, FaFileAlt, FaFileCode, FaFileImage } from "react-icons/fa";

interface InvalidFileProps {
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
}

const InvalidFile: FC<InvalidFileProps> = (props: InvalidFileProps) => {
	return (
		<div
			className={`fixed w-screen h-screen bg-black transition-all ease-in-out top-0 bg-opacity-80 left-0 ${
				props.show ? "z-50" : "-z-50"
			} flex justify-center items-center`}
			onClick={() => props.setShow(false)}
		>
			<div
				className={`p-2 bg-red-500 transition-all rounded-[0.2rem] ${
					props.show ? "scale-100" : "scale-0"
				}`}
			>
				<div className="w-full h-full flex flex-col items-center justify-end px-5 pb-3 pt-16 border-[1px] border-dashed border-gray-300 rounded-md">
					<div className="flex items-center absolute gap-0 -translate-y-[4.5rem]">
						<FaFileAlt
							color="black"
							className="w-24 h-24 fill-indigo-200 translate-y-3 translate-x-12 -rotate-[30deg]"
						/>
						<FaFileImage className="w-24 z-[31] h-24 fill-indigo-100" />
						<FaFileCode className="w-24 h-24 fill-indigo-200 translate-y-3 -translate-x-12 rotate-[30deg]" />
					</div>
					<div className="font-bold text-xl cursor-default">
						Invalid File Type
					</div>
					<div className="text-xs cursor-default">
						Hmm... I don't think we support that type of file.
					</div>
				</div>
			</div>
		</div>
	);
};

export default InvalidFile;
