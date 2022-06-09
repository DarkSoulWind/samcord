import type { NextPage } from "next";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase-config";

import Sidebar from "../components/Sidebar/Sidebar";
import Channel from "../components/Channel/Channel";
import Modal from "../components/Modal";

const Home: NextPage = () => {
	const [showLogin, setShowLogin] = useState(false);
	const [loggingIn, setLoggingIn] = useState(false);
	const [user] = useAuthState(auth);

	const signInWithGoogle = () => {
		setLoggingIn(true);
		signInWithPopup(auth, provider)
			.then((result) => {
				console.log(result);
				setLoggingIn(false);
			})
			.catch((err) => {
				console.error(err);
				setLoggingIn(false);
			});
	};

	const signUserOut = () => {
		signOut(auth).then(() => {
			console.log("signed out");
		});
	};

	return (
		<div className="bg-discord-500 font-sans w-screen h-screen">
			<Sidebar
				showLogin={showLogin}
				setShowLogin={setShowLogin}
				user={user}
			/>
			<Modal
				isOpen={showLogin}
				setIsOpen={setShowLogin}
				title={user ? "Logout" : "Login"}
				description={
					user
						? "You are already logged in."
						: "You must be logged in with Google."
				}
				actionButtonText={user ? "Logout" : "Login"}
				onActionButtonClick={() =>
					user ? signUserOut() : signInWithGoogle()
				}
				loadingState={loggingIn}
			/>
			<Channel name="samcord" user={user} />
		</div>
	);
};

export default Home;
