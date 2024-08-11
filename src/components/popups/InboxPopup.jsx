import React from "react";
import { Link } from "react-router-dom";
import { Divider } from "../Dividers";

const InboxPopup = () => {
	return (
		<div className="fixed shadow bg-white rounded-lg top-24 right-[3%] w-72">
			<div className="flex justify-between items-center p-4 pb-2 gap-4">
				<p className="font-trap-grotesk font-semibold">Inbox</p>
			</div>
			<Divider />
			<div className="flex flex-col gap-3 p-4 text-center">
				<div className="bg-[#fff6ff] py-4 px-3 rounded-lg">
					No messages right now
				</div>
				<Link
					to="/courses"
					className="text-primaryBlue text-center font-trap-grotesk font-medium"
				>
					View inbox
				</Link>
			</div>
		</div>
	);
};

export default InboxPopup;
