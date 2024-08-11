import React from "react";
import ChatUser from "./ChatUser";

const ChatHistory = () => {
	return (
		<div className="bg-white pr-4 pt-4 border-r-[0.5px] border-r-lightGray w-[30%] fixed top-20 bottom-0 left-[20%] overflow-auto">
			<div className="h-full">
				<ul className="flex flex-col gap-7 py-4">
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
					<ChatUser />
				</ul>
			</div>
		</div>
	);
};

export default ChatHistory;
