import React, { useState, useEffect } from "react";
import video from "/icons/video.svg";
import book from "/icons/book.svg";
import arrowup from "/icons/arrow-up.svg";
import arrowdown from "/icons/arrow-down.svg";
import whitecheck from "/icons/white-check.svg";
import bluecheck from "/icons/blue-check.svg";
import { formatVideoDuration } from "../../utils/utils";

export const CourseModule = ({
	lessonTitle,
	lessonItems,
	isExpanded,
	onToggle,
}) => {
	const [isOpen, setIsOpen] = useState(isExpanded);

	useEffect(() => {
		setIsOpen(isExpanded);
	}, [isExpanded]);

	const toggleModule = () => {
		setIsOpen((prev) => {
			const newOpen = !prev;
			onToggle(newOpen);
			return newOpen;
		});
	};

	const totalTopics = lessonItems.length;
	const topicLabel = totalTopics === 1 ? "Topic" : "Topics";
	const totalDurationInSeconds = lessonItems?.reduce((total, item) => {
		return total + (item.videoDurationInSeconds || 0);
	}, 0);

	const formattedTotalDuration = formatVideoDuration(totalDurationInSeconds);

	return (
		<div className=" w-full border border-lightGray">
			<div
				className="flex gap-2 bg-nude p-3 cursor-pointer transition-all ease-in duration-300"
				onClick={toggleModule}
			>
				<span className="transform transition-transform duration-300">
					<img
						src={isOpen ? arrowup : arrowdown}
						alt="Toggle icon"
						className="w-4 h-4"
					/>
				</span>
				<div className="flex justify-between w-full">
					<h3>{lessonTitle}</h3>
					<p className="text-sm text-darkGray">
						{totalTopics} {topicLabel}{" "}
						{totalDurationInSeconds > 0 && (
							<>• {formattedTotalDuration}</>
						)}
					</p>
				</div>
			</div>
			{isOpen && (
				<div className="submodules bg-white p-3">
					{lessonItems?.map((items, index) => (
						<div key={index} className="flex gap-2 pb-2">
							<img
								className="w-5"
								src={items.contentType === "video" ? video : book}
								alt={
									items.contentType === "video"
										? "Video Icon"
										: "Book Icon"
								}
							/>
							<div className="text-darkGray opacity-80 flex justify-between w-full">
								<p className="font-semibold">{items.title}</p>
								{items.contentType === "video" &&
								items.videoDurationInSeconds ? (
									<p>
										{formatVideoDuration(
											items.videoDurationInSeconds
										)}
									</p>
								) : null}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export const ContentModule = ({
	lessonTitle,
	lessonItems,
	isExpanded,
	onToggle,
	onTopicSelect,
	onMarkAsCompleted,
	completedItems,
}) => {
	const [isOpen, setIsOpen] = useState(isExpanded);

	useEffect(() => {
		setIsOpen(isExpanded);
	}, [isExpanded]);

	const toggleModule = () => {
		setIsOpen((prev) => {
			const newOpen = !prev;
			onToggle(newOpen);
			return newOpen;
		});
	};

	const totalTopics = lessonItems.length;
	const topicLabel = totalTopics === 1 ? "Topic" : "Topics";

	const totalDurationInSeconds = lessonItems?.reduce((total, item) => {
		return total + (item.videoDurationInSeconds || 0);
	}, 0);

	const formattedTotalDuration = formatVideoDuration(totalDurationInSeconds);

	return (
		<div className="w-full border border-lightGray">
			<div
				className="flex gap-2 bg-white p-3 cursor-pointer transition-all ease-in duration-300"
				onClick={toggleModule}
			>
				<span className="transform transition-transform duration-300">
					<img
						src={isOpen ? arrowup : arrowdown}
						alt="Toggle icon"
						className="w-4 h-4"
					/>
				</span>
				<div className="flex justify-between w-full">
					<h3>{lessonTitle}</h3>
					<p className="text-xs text-darkGray">
						{totalTopics} {topicLabel}{" "}
						{totalDurationInSeconds > 0 && (
							<> • {formattedTotalDuration}</>
						)}
					</p>
				</div>
			</div>
			{isOpen && (
				<div className="bg-white p-3">
					{lessonItems?.map((item, index) => (
						<div
							key={index}
							className="flex gap-2 pb-2 cursor-pointer items-center"
						>
							<img
								className="w-3"
								src={item.contentType === "video" ? video : book}
								alt={
									item.contentType === "video"
										? "Video Icon"
										: "Book Icon"
								}
							/>
							<div className="text-darkGray opacity-80 flex justify-between w-full">
								<p
									className="font-medium text-sm font-trap-grotesk"
									onClick={() => onTopicSelect(item)}
								>
									{item.title}
								</p>
								<div></div>
								{/* {item.contentType === "video" &&
									item.videoDurationInSeconds && (
										<p>
											{formatVideoDuration(
												item.videoDurationInSeconds
											)}
										</p>
									)} */}
								<img
									className="w-4 cursor-pointer"
									src={item.isCompleted ? bluecheck : whitecheck}
									alt="complete"
									onClick={() => onMarkAsCompleted(item)}
								/>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export const QuizModule = ({ quizTitle, quizItems, isExpanded, onToggle }) => {
	const [isOpen, setIsOpen] = useState(isExpanded);

	useEffect(() => {
		setIsOpen(isExpanded);
	}, [isExpanded]);

	const toggleModule = () => {
		setIsOpen((prev) => {
			const newOpen = !prev;
			onToggle(newOpen);
			return newOpen;
		});
	};

	return (
		<div className=" w-full border border-lightGray">
			<div
				className="flex gap-2 bg-nude p-3 cursor-pointer transition-all ease-in duration-300"
				onClick={toggleModule}
			>
				<span className="transform transition-transform duration-300">
					<img
						src={isOpen ? arrowup : arrowdown}
						alt="Toggle icon"
						className="w-4 h-4"
					/>
				</span>
				<div className="flex justify-between w-full">
					<h3>{quizTitle}</h3>
				</div>
			</div>
			{isOpen && (
				<div className="submodules bg-white p-3">
					{quizItems?.map((quiz, index) => (
						<div key={index} className="mb-4">
							<div className="flex items-center gap-3">
								<img className="w-5" src={book} alt="Book Icon" />
								<h5 className="font-semibold">{quiz.title}</h5>
							</div>

							{quiz.questions?.map((question, index) => (
								<div key={index} className="quiz-question my-2">
									<div className="flex gap-2 items-center">
										<p>Question {index + 1}:</p>
										<p className="font-medium">
											{question.questionText}
										</p>
									</div>
									{/* <ul className="quiz-options list-disc ml-5">
										{question.answers?.map((answer, aIndex) => (
											<li key={aIndex} className="text-darkGray">
												{answer.option}
											</li>
										))}
									</ul> */}
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export const QuizSidebar = ({
	quizTitle,
	quizItems,
	isExpanded,
	onToggle,
	onQuizSelect,
	completed,
}) => {
	const [isOpen, setIsOpen] = useState(isExpanded);

	useEffect(() => {
		setIsOpen(isExpanded);
	}, [isExpanded]);

	const toggleModule = () => {
		setIsOpen((prev) => {
			const newOpen = !prev;
			onToggle(newOpen);
			return newOpen;
		});
	};

	return (
		<div className=" w-full border border-lightGray">
			<div
				className="flex gap-2 bg-white p-3 cursor-pointer transition-all ease-in duration-300"
				onClick={toggleModule}
			>
				<span className="transform transition-transform duration-300">
					<img
						src={isOpen ? arrowup : arrowdown}
						alt="Toggle icon"
						className="w-4 h-4"
					/>
				</span>
				<div className="flex justify-between w-full">
					<h3>{quizTitle}</h3>
				</div>
			</div>
			{isOpen && (
				<div className="bg-white p-3 cursor-pointer">
					{quizItems?.map((quiz, index) => (
						<div key={index} className="mb-4" onClick={onQuizSelect}>
							<div className="flex items-center gap-3">
								<img className="w-5" src={book} alt="Book Icon" />
								<h5 className="font-medium font-trap-grotesk text-sm">
									{quiz.title}
								</h5>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
