import React from "react";
import profile from "/profile-img1.svg";

const ChatUser = () => {
	return (
		<div className="flex gap-2 justify-between items-center">
			<div className="flex gap-2">
				<div className="w-1/5">
					<img src={profile} className="w-full" />
				</div>
				<div>
					<h5 className="font-trap-grotesk font-bold">John Doe</h5>
					<p className="text-xs text-lightGray">
						It is with great pleasure...
					</p>
				</div>
			</div>
			<p className="uppercase text-xs text-lightGray">10:09 am</p>
		</div>
	);
};

export default ChatUser;
