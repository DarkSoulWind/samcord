import type { NextPage } from "next";
import { useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Channel from "../components/Channel/Channel";
import Modal from "../components/Modal";

const Home: NextPage = () => {
	const [showLogin, setShowLogin] = useState(true);

	return (
		<div className="bg-discord-500 font-sans w-screen h-screen">
			<Sidebar showLogin={showLogin} setShowLogin={setShowLogin} />
			<Modal
				isOpen={showLogin}
				setIsOpen={setShowLogin}
				title="Login"
				description="You must be logged in."
				actionButtonText="Login"
				onActionButtonClick={() => console.log("yo")}
			/>
			<Channel name="samcord" />
		</div>
	);
};

export default Home;
