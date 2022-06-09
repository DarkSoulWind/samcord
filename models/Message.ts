import { Timestamp } from "firebase/firestore";

export interface Message {
	id: string;
	date: Timestamp;
	pfp: string;
	username: string;
	text: string;
}
