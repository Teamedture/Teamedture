import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { PrimaryButton } from "../Button";
import { userContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import arrowright from "/icons/arrow-right-active.svg";
import sendicon from "/icons/send.svg";
import activesendicon from "/icons/send-active.svg";

const ChatUI = ({ courseId, token }) => {
	const { user, courseById, fetchCourseById } = useContext(userContext);
	const userId = user?.id;
	const [messages, setMessages] = useState([]);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [sendingMessageId, setSendingMessageId] = useState(null);
	const endOfMessagesRef = useRef(null);

	useEffect(() => {
		if (courseId) {
			fetchCourseById(courseId);
		}
	}, []);

	const formatTime = (timestamp) => {
		const [hour, minute] = timestamp.split(":").map(Number);
		const date = new Date();
		date.setHours(hour + 1);
		date.setMinutes(minute);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const fetchMessages = async () => {
		try {
			const response = await axios.get(
				`https://edture.onrender.com/chats/courses/${courseId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const groupedMessages = response.data.data.reduce((acc, message) => {
				const formattedTimestamp = formatTime(message.timestamp);
				if (!acc[formattedTimestamp]) {
					acc[formattedTimestamp] = [];
				}
				acc[formattedTimestamp].push(message);
				return acc;
			}, {});

			const formattedMessages = Object.entries(groupedMessages)
				.map(([timestamp, messages]) => ({
					timestamp,
					messages,
				}))
				.sort(
					(a, b) =>
						new Date(`1970-01-01T${a.timestamp}:00`) -
						new Date(`1970-01-01T${b.timestamp}:00`)
				);

			setMessages(formattedMessages);
		} catch (error) {
			console.error("Error fetching messages:", error);
		}
	};

	useEffect(() => {
		fetchMessages();
	}, [courseId, token]);

	const handleSendMessage = async () => {
		if (newMessage.trim()) {
			const tempMessageId = Date.now();
			const tempMessage = {
				userId: userId,
				messages: [newMessage],
				timestamp: formatTime(
					new Date().toISOString().split("T")[1].substring(0, 5)
				),
				initial: user.initial,
				id: tempMessageId,
				sending: true,
			};

			setMessages((prevMessages) => {
				const timestamp = tempMessage.timestamp;
				const existingGroup = prevMessages.find(
					(group) => group.timestamp === timestamp
				);

				if (existingGroup) {
					return prevMessages.map((group) =>
						group.timestamp === timestamp
							? { ...group, messages: [...group.messages, tempMessage] }
							: group
					);
				} else {
					return [...prevMessages, { timestamp, messages: [tempMessage] }];
				}
			});
			setNewMessage("");
			setSendingMessageId(tempMessageId);

			try {
				await axios.post(
					`https://edture.onrender.com/chats/courses/${courseId}`,
					{ message: newMessage },
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setMessages((prevMessages) =>
					prevMessages.map((group) => ({
						...group,
						messages: group.messages.map((msg) =>
							msg.id === tempMessageId ? { ...msg, sending: false } : msg
						),
					}))
				);
				setSendingMessageId(null);
				fetchMessages();
			} catch (error) {
				console.error("Error sending message:", error);
				setSendingMessageId(null);
			}
		}
	};

	useEffect(() => {
		endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const shouldShowInitials = (messageGroup, index) => {
		const isLastMessageInGroup = messageGroup.messages.length - 1;
		const message = messageGroup.messages[isLastMessageInGroup];

		if (index === messages.length - 1) {
			return !message.sending;
		}

		const nextGroup = messages[index + 1];
		return (
			nextGroup.messages[0].userId !== message.userId && !message.sending
		);
	};

	return (
		<div className="px-12">
			<div className=" flex flex-col gap-3 py-6">
				<div className="flex gap-1 text-primaryBlue font-trap-grotesk items-center text-sm">
					<Link
						// to={`/courses/course-content/${courseId}`}
						className="font-trap-grotesk"
					>
						Home
					</Link>
					<img src={arrowright} />
					<Link className="font-trap-grotesk">Chat</Link>
				</div>
				<h2 className="text-2xl font-semibold">
					{courseById?.data?.title || "Course Chat"}
				</h2>
			</div>
			<div
				className="flex flex-col h-[800px] overflow-y-auto bg-gray-100 border border-b-0 border-lightGray rounded-tr-lg rounded-tl-lg bg-center bg-cover bg-nude"
				style={{ backgroundImage: "url('/chat-bg.svg')" }}
			>
				<div className="flex-1 p-10 overflow-y-auto">
					{messages.map((messageGroup, index) => {
						const showInitials = shouldShowInitials(messageGroup, index);
						return (
							<div
								key={messageGroup.timestamp}
								className={`mb-4 ${!showInitials ? "px-12" : ""}`}
							>
								<div className="flex flex-col">
									{messageGroup.messages.map((message, msgIndex) => (
										<div
											key={msgIndex}
											className={`mt-2 flex ${
												message.userId === userId
													? "justify-end items-end"
													: "justify-start items-end"
											}`}
										>
											{message.userId !== userId &&
												showInitials &&
												!message.sending && (
													<div className="flex-shrink-0 w-10 h-10 rounded-full bg-primaryBlue text-white text-center flex items-center justify-center mr-2">
														{message.initial}
													</div>
												)}
											<div
												className={`text-left rounded-lg max-w-md text-darkGray ${
													message.userId === userId
														? "ml-auto"
														: "mr-auto"
												}`}
											>
												<div className="bg-white p-3 flex flex-col justify-between gap-1 rounded-md">
													<div>{message.messages.join(", ")}</div>
													<div className="text-xs text-lightGray self-end text-right">
														{messageGroup.timestamp}
													</div>
												</div>
												{message.sending && (
													<span
														className={`text-xs pt-2 text-lightGray text-right`}
													>
														Sending...
													</span>
												)}
											</div>
											{message.userId === userId &&
												showInitials &&
												!message.sending && (
													<div className="flex-shrink-0 w-10 h-10 rounded-full bg-primaryBlue text-white text-center flex items-center justify-center ml-2">
														{message.initial}
													</div>
												)}
										</div>
									))}
								</div>
							</div>
						);
					})}
					<div ref={endOfMessagesRef} />
				</div>
				<div className="p-4 border-t border-lightGray bg-white flex items-center">
					<textarea
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onFocus={() => setIsInputFocused(true)}
						onBlur={() => setIsInputFocused(false)}
						placeholder="Type your message..."
						className="flex-1 border border-lightGray rounded-md p-3 mr-2"
						rows="1"
					/>
					<button
						disabled={!newMessage.trim() && !isInputFocused}
						onClick={handleSendMessage}
						className={`rounded-full text-lg p-3 py-3 transition-all ease-in cursor-pointer ${
							!newMessage.trim() && !isInputFocused
								? "bg-lighterGray text-lightGray cursor-not-allowed"
								: "bg-primaryBlue hover:bg-hoverBlue text-white"
						}`}
					>
						<img
							src={
								!newMessage.trim() && !isInputFocused
									? sendicon
									: activesendicon
							}
							alt="Send"
						/>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatUI;
