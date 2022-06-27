import { User } from "firebase/auth";
import React, { FC, useState, useRef, ChangeEvent } from "react";
import { FaHashtag, FaPaperPlane, FaPlus, FaTrash } from "react-icons/fa";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { CensorSensor } from "censor-sensor";

import MessageContainer from "./MessageContainer";
import InvalidFile from "../InvalidFile";

interface ChannelProps {
	name: string;
	user: User | null | undefined;
}

interface SelectedImage {
	file?: File;
	src?: string;
	name?: string;
}

const acceptableExtensions = [".jpg", ".jpeg", ".png"];

const Channel: FC<ChannelProps> = (props: ChannelProps) => {
	const [textInput, setTextInput] = useState("");
	const [imageUploadProgress, setImageUploadProgress] = useState(0);
	const [sendingMessage, setSendingMessage] = useState(false);
	const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
		null
	);
	const [viewingImage, setViewingImage] = useState("");
	const [showInvalidFile, setShowInvalidFile] = useState(true);

	const messagesRef = collection(db, "messages");
	const scrollToBottomRef = useRef<null | HTMLDivElement>(null);
	const textInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const censor = new CensorSensor();

	const checkValidFilename = (filePath: string) => {
		if (censor.isProfaneIsh(filePath)) {
			return false;
		}
		for (const extension of acceptableExtensions) {
			if (filePath.endsWith(extension)) {
				return true;
			}
		}

		setShowInvalidFile(true);
		return false;
	};

	const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;

		const file = e.target.files?.[0];
		const name = file?.name;
		if (name && !checkValidFilename(name)) {
			e.target.files = null;
			e.target.value = "";
			return;
		}
		const blobFile = e.target.files?.[0] as Blob;
		let reader = new FileReader();

		reader.onload = (e) => {
			setSelectedImage({ src: e?.target?.result as string, name, file });
		};
		reader.readAsDataURL(blobFile);
	};

	const fileUpload = async (image: SelectedImage | null) => {
		if (!image) return;
		return new Promise<string>((resolve, reject) => {
			const { file, name } = image;
			if (!file) reject();
			console.log(name);
			const uploadedImagesRef = ref(storage, `images/${name}`);
			const uploadTask = uploadBytesResumable(
				uploadedImagesRef,
				file as Blob
			);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log(`Upload is ${progress}% done`);
					setImageUploadProgress(progress);
				},
				(error: any) => {
					console.log(error);
					reject(error);
				},
				() => {
					getDownloadURL(uploadedImagesRef).then((url) => {
						console.log(`The image is at ${url}`);
						resolve(url);
					});
				}
			);
		});
	};

	const submitMessage = async () => {
		if (textInput.trim() === "" && !imageInputRef.current?.files) return;

		setSendingMessage(true);
		let imageURL = await fileUpload(selectedImage);
		let imageName = selectedImage?.name;
		console.log(imageName);

		let data = {
			date: Timestamp.now(),
			pfp: props.user?.photoURL,
			username: props.user?.displayName,
			text: censor.cleanProfanity(textInput),
			imageURL: imageURL || null,
			imageName: imageName || null,
		};

		await addDoc(messagesRef, data);
		scrollToBottomRef?.current?.scrollIntoView({ behavior: "smooth" });
		textInputRef.current?.focus();
		setTextInput("");
		setSelectedImage(null);
		setSendingMessage(false);
		setImageUploadProgress(0);
	};

	return (
		<div className="ml-16 py-2 flex flex-col h-screen text-white overflow-hidden">
			{/* CHANNEL NAME */}
			<div className="w-full flex gap-1 justify-start items-center border-b-[1px] pb-2 border-b-discord-700">
				<FaHashtag className="w-4 h-4 fill-discord-100 ml-3" />
				<div className="font-bold text-sm">{props.name}</div>
			</div>

			<InvalidFile show={showInvalidFile} setShow={setShowInvalidFile} />

			{/* IMAGE VIEWER */}
			<div
				className={`${
					viewingImage.trim() == "" ? "scale-0" : "scale-100"
				} fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 z-50 transition-all duration-500 flex justify-center items-center`}
			>
				<div className="flex h-full gap-10 justify-center">
					<button
						onClick={() => setViewingImage("")}
						className="m-2 px-4 py-[0.1rem] md:py-1 rounded-md bg-discord-200 hover:opacity-60 transition-all font-bold absolute top-0 left-0 text-sm md:text-base"
					>
						Close
					</button>
					<button
						onClick={() => window.open(viewingImage, "_blank")}
						className="mt-2 ml-24 px-4 py-[0.1rem] md:py-1 rounded-md bg-discord-200 hover:opacity-60 transition-all font-bold absolute top-0 left-0 text-sm md:text-base"
					>
						Open original
					</button>
				</div>
				<div className="relative w-[75%] h-[75%] md:w-[85%] md:h-[85%]">
					{viewingImage.trim() != "" && (
						<Image
							src={viewingImage}
							layout="fill"
							objectFit="contain"
						/>
					)}
				</div>
			</div>

			{/* ALL MESSAGES ARE HERE */}
			<MessageContainer
				channelName={props.name}
				user={props.user}
				scrollToBottomRef={scrollToBottomRef}
				setViewingImage={setViewingImage}
			/>

			{/* Text input box */}
			<form
				className="px-3 gap-2 w-full flex mb-2"
				autoComplete="off"
				autoCapitalize="off"
				spellCheck="false"
				onSubmit={(e) => {
					e.preventDefault();
					if (!props.user) return;
					if (sendingMessage || imageUploadProgress > 0) return;
					submitMessage();
				}}
			>
				<div className="flex flex-col w-full">
					{/* SHOW IMAGE ATTACHMENT */}
					{selectedImage && (
						<div>
							<div className="flex w-full rounded-t-md bg-discord-300 flex-start p-3">
								<div className="bg-discord-600 rounded-md pt-2 px-5">
									<img
										src={selectedImage.src}
										className="max-h-40"
									/>
									<div className="text-xs my-2">
										{selectedImage.name}
									</div>
								</div>
								{/* REMOVE ATTACHMENT BUTTON */}
								<div
									className="relative"
									onClick={(e) => {
										setSelectedImage(null);
										imageInputRef.current!.value = "";
										imageInputRef.current!.files = null;
									}}
								>
									<div className="absolute -top-1 -right-3 bg-discord-500 hover:bg-discord-300 p-1 rounded-sm border-[1px] border-discord-700 group">
										<FaTrash className="fill-red-600" />
										<div className="absolute scale-0 group-hover:scale-100 transition-all -right-6 bg-discord-800 p-1 rounded-md text-xs text-white -top-11">
											Remove Attachment
										</div>
									</div>
								</div>
							</div>
							{/* PROGRESS BAR */}
							{imageUploadProgress > 0 && (
								<div className="flex justify-start w-full">
									<div
										className={`w-[${imageUploadProgress}%] bg-discord-200 h-1 transition-all`}
									></div>
								</div>
							)}
						</div>
					)}
					{/* TEXTBOX */}
					<div
						className={`w-full h-10 flex items-center ${
							selectedImage
								? "rounded-b-md border-t-[1px] border-discord-15"
								: "rounded-md"
						} bg-discord-300 px-3`}
					>
						{/* IMAGE UPLOAD BUTTON */}
						<div
							onClick={() => imageInputRef.current?.click()}
							className={`${
								props.user ? "block" : "hidden"
							} bg-discord-100 hover:cursor-pointer hover:bg-white w-5 h-5 transition-all rounded-full aspect-square flex items-center justify-center`}
						>
							<FaPlus className="w-3 h-3 fill-discord-300" />

							<input
								type="file"
								className="w-full h-full hidden opacity-0 file:hidden"
								onChange={handleImage}
								ref={imageInputRef}
								disabled={
									sendingMessage || imageUploadProgress > 0
								}
								name=""
								id=""
							/>
						</div>
						{/* TEXT INPUT */}
						<input
							className="text-white w-full outline-none rounded-md bg-transparent mx-3 text-xs"
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
							disabled={
								!props.user ||
								sendingMessage ||
								imageUploadProgress > 0
							}
							ref={textInputRef}
						/>
					</div>
				</div>
				{/* SUBMIT BUTTON */}
				<button
					type="submit"
					className={`${
						props.user ? "block" : "hidden"
					} mt-auto w-10 h-10 aspect-square bg-discord-200 rounded-full flex justify-center hover:opacity-60 transition-all items-center`}
					disabled={
						!props.user || sendingMessage || imageUploadProgress > 0
					}
				>
					<FaPaperPlane className="w-5 h-5 fill-white active:opacity-50 transition-all ease-in" />
				</button>
			</form>
		</div>
	);
};

export default Channel;
