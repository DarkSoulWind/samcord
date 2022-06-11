import type { NextPage } from "next";
import Head from "next/head";
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
			<Head>
				{/* favicon */}
				<link
					rel="icon"
					href="https://samsoongterminal.harryazaan.repl.co/assets/favicon.ico"
					type="image/x-icon"
				/>
				<title>Samcord</title>
				<meta name="description" content="Discord but made by Salman" />
			</Head>
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
						? `You are logged in as ${user.displayName}.`
						: "You must be logged in with Google to send messages."
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
