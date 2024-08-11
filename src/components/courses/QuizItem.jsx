import React, { useState, useEffect } from "react";
import { SecondaryButton, PrimaryButton, IconButton } from "../Button";
import {
	InputField,
	RadioTextGroup,
	RadioTextTrueFalse,
	TextAreaField,
} from "../inputs/CourseCreationInputs";
import { Divider } from "../Dividers";
import arrowup from "/icons/arrow-up.svg";
import arrowdown from "/icons/arrow-down.svg";
import addicon from "/icons/add-course.svg";
import check from "/icons/blue-check.svg";
import deleteicon from "/icons/delete.svg";
import editicon from "/icons/edit.svg";
import videoicon from "/icons/video-play.svg";
import documentfile from "/icons/document-download.svg";
import documenttext from "/icons/document-text.svg";
import texticon from "/icons/text-lesson.svg";

export const AddQuizInput = ({ addQuiz, onCancel }) => {
	const [quizTitle, setQuizTitle] = useState("");

	const handleAdd = () => {
		if (quizTitle) {
			addQuiz({ id: Date.now(), quizTitle, questions: [] });
			setQuizTitle("");
			onCancel();
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<h4 className="font-medium text-lg">New Quiz:</h4>
			<InputField
				type="text"
				placeholder="Enter quiz title"
				value={quizTitle}
				onChange={(e) => setQuizTitle(e.target.value)}
				className="border border-lightGray rounded-lg p-4 px-5"
			/>
			<div className="flex gap-2 self-end">
				<PrimaryButton onClick={handleAdd} text="Add quiz" />
				<SecondaryButton onClick={onCancel} text="Cancel" />
			</div>
		</div>
	);
};

const EditQuestionForm = ({ questionData, onSave, onCancel }) => {
	const [question, setQuestion] = useState("");
	const [contentType, setContentType] = useState("");
	const [answers, setAnswers] = useState([]);

	useEffect(() => {
		if (questionData) {
			setQuestion(questionData.question);
			setContentType(questionData.type);
			setAnswers(questionData.answers);
		}
	}, [questionData]);

	const handleSave = () => {
		onSave({
			question,
			type: contentType,
			answers,
		});
	};

	return (
		<div className="flex flex-col gap-2">
			<TextAreaField
				placeholder="Enter Question"
				rows="8"
				value={question}
				onChange={(e) => setQuestion(e.target.value)}
			/>
			{contentType === "multipleChoice" && (
				<>
					<h4>Add Answers</h4>
					<RadioTextGroup data={answers} onDataChange={setAnswers} />
				</>
			)}
			{contentType === "trueFalse" && (
				<>
					<h4>Add Answers</h4>
					<RadioTextTrueFalse data={answers} onDataChange={setAnswers} />
				</>
			)}
			<div className="flex gap-2 mt-4">
				<PrimaryButton onClick={handleSave} text="Save" />
				<SecondaryButton onClick={onCancel} text="Cancel" />
			</div>
		</div>
	);
};

const QuestionForm = ({ questionData, onSave, onCancel, contentType }) => {
	const [question, setQuestion] = useState("");
	const [error, setError] = useState("");

	const [radioTextGroupData, setRadioTextGroupData] = useState({
		selectedValue: "",
		textValues: {
			option1: "",
			option2: "",
			option3: "",
			option4: "",
		},
	});
	const [radioTextTrueFalseData, setRadioTextTrueFalseData] = useState({
		selectedValue: "",
		textValues: {
			option1: "True",
			option2: "False",
		},
	});

	useEffect(() => {
		if (questionData) {
			setQuestion(questionData.question);
			if (contentType === "multipleChoice") {
				setRadioTextGroupData({
					selectedValue: questionData.correctAnswer.value,
					textValues: questionData.answers,
				});
			} else if (contentType === "trueFalse") {
				setRadioTextTrueFalseData({
					selectedValue: questionData.correctAnswer,
					textValues: questionData.answers,
				});
			}
		}
		console.log("content type", contentType, questionData);
	}, [questionData, contentType]);

	const handleRadioTextGroupChange = (data) => {
		setRadioTextGroupData(data);
	};

	const handleRadioTextTrueFalseChange = (data) => {
		setRadioTextTrueFalseData(data);
	};

	const handleSave = () => {
		if (
			(contentType === "multipleChoice" &&
				!radioTextGroupData.selectedValue) ||
			(contentType === "trueFalse" && !radioTextTrueFalseData.selectedValue)
		) {
			setError("Please select a correct answer");
			return;
		}
		const content = {
			question,
			type: contentType,
			answers:
				contentType === "multipleChoice"
					? radioTextGroupData.textValues
					: radioTextTrueFalseData.textValues,
			correctAnswer:
				contentType === "multipleChoice"
					? radioTextGroupData.selectedValue
					: radioTextTrueFalseData.selectedValue,
		};
		onSave(content);
	};

	return (
		<div className="flex flex-col gap-2 mt-4">
			<TextAreaField
				placeholder="Enter Question"
				rows="8"
				value={question}
				onChange={(e) => setQuestion(e.target.value)}
			/>
			{contentType === "multipleChoice" && (
				<>
					<h4>Add Answers</h4>
					<RadioTextGroup
						data={radioTextGroupData}
						onDataChange={handleRadioTextGroupChange}
					/>
					<div className="flex gap-2 mt-4">
						<PrimaryButton onClick={handleSave} text="Save" />
						<SecondaryButton onClick={onCancel} text="Cancel" />
					</div>
				</>
			)}
			{contentType === "trueFalse" && (
				<>
					<h4>Add Answers</h4>
					<RadioTextTrueFalse
						data={radioTextTrueFalseData}
						onDataChange={handleRadioTextTrueFalseChange}
					/>
					<div className="flex gap-2 mt-4">
						<PrimaryButton onClick={handleSave} text="Save" />
						<SecondaryButton onClick={onCancel} text="Cancel" />
					</div>
				</>
			)}
			{error && <p className="text-red">{error}</p>}
		</div>
	);
};

// const QuestionForm = ({ questionData, onSave, onCancel, contentType }) => {
// 	const [question, setQuestion] = useState("");
// 	const [radioTextGroupData, setRadioTextGroupData] = useState({
// 		selectedValue: "",
// 		textValues: {
// 			option1: "",
// 			option2: "",
// 			option3: "",
// 			option4: "",
// 		},
// 	});
// 	const [radioTextTrueFalseData, setRadioTextTrueFalseData] = useState({
// 		selectedValue: "",
// 		textValues: {
// 			option1: "",
// 			option2: "",
// 		},
// 	});

// 	useEffect(() => {
// 		if (questionData) {
// 			setQuestion(questionData.question);
// 			if (contentType === "multipleChoice") {
// 				setRadioTextGroupData({
// 					selectedValue: questionData.correctAnswer,
// 					textValues: questionData.answers,
// 				});
// 			} else if (contentType === "trueFalse") {
// 				setRadioTextTrueFalseData({
// 					selectedValue: questionData.correctAnswer,
// 					textValues: questionData.answers,
// 				});
// 			}
// 		}
// 		console.log("content type", contentType, questionData);
// 	}, [questionData, contentType]);

// 	const handleRadioTextGroupChange = (data) => {
// 		setRadioTextGroupData(data);
// 	};

// 	const handleRadioTextTrueFalseChange = (data) => {
// 		setRadioTextTrueFalseData(data);
// 	};

// 	const handleSave = () => {
// 		const content = {
// 			question,
// 			type: contentType,
// 			answers:
// 				contentType === "multipleChoice"
// 					? radioTextGroupData.textValues
// 					: radioTextTrueFalseData.textValues,
// 			correctAnswer:
// 				contentType === "multipleChoice"
// 					? radioTextGroupData.selectedValue
// 					: radioTextTrueFalseData.selectedValue,
// 		};
// 		onSave(content);
// 	};

// 	return (
// 		<div className="flex flex-col gap-2 mt-4">
// 			<TextAreaField
// 				placeholder="Enter Question"
// 				rows="8"
// 				value={question}
// 				onChange={(e) => setQuestion(e.target.value)}
// 			/>
// 			{contentType === "multipleChoice" && (
// 				<>
// 					<h4>Add Answers</h4>
// 					<RadioTextGroup
// 						data={radioTextGroupData}
// 						onDataChange={handleRadioTextGroupChange}
// 					/>
// 					<div className="flex gap-2 mt-4">
// 						<PrimaryButton onClick={handleSave} text="Save" />
// 						<SecondaryButton onClick={onCancel} text="Cancel" />
// 					</div>
// 				</>
// 			)}
// 			{contentType === "trueFalse" && (
// 				<>
// 					<h4>Add Answers</h4>
// 					<RadioTextTrueFalse
// 						data={radioTextTrueFalseData}
// 						onDataChange={handleRadioTextTrueFalseChange}
// 					/>
// 					<div className="flex gap-2 mt-4">
// 						<PrimaryButton onClick={handleSave} text="Save" />
// 						<SecondaryButton onClick={onCancel} text="Cancel" />
// 					</div>
// 				</>
// 			)}
// 		</div>
// 	);
// };

export const QuizItem = ({ item, updateQuizItem, deleteQuizItem }) => {
	const [showAddQuestion, setShowAddQuestion] = useState(false);
	const [showContent, setShowContent] = useState(false);
	const [showAddContent, setShowAddContent] = useState(false);
	const [contentAdded, setContentAdded] = useState(false);
	const [showEditForm, setShowEditForm] = useState(false);
	const [editQuestionIndex, setEditQuestionIndex] = useState(null);
	const [contentType, setContentType] = useState(null);

	const handleAddQuestion = (question) => {
		const updatedItem = { ...item, questions: [...item.questions, question] };
		updateQuizItem(updatedItem);
		setContentAdded(true);
		setShowContent(true);
		setShowAddQuestion(false);
		setShowAddContent(false);
	};

	const handleContentAdded = (content) => {
		handleAddQuestion(content);
	};

	const handleEditQuestion = (index) => {
		setEditQuestionIndex(index);
		setContentType(item.questions[index].type);
		setShowEditForm(true);
	};

	const handleSaveEdit = (editedQuestion) => {
		const updatedItem = { ...item };
		updatedItem.questions[editQuestionIndex] = {
			...updatedItem.questions[editQuestionIndex],
			...editedQuestion,
		};
		updateQuizItem(updatedItem);
		setEditQuestionIndex(null);
		setShowEditForm(false);
	};

	const handleDeleteQuestion = (questionId) => {
		const updatedItem = {
			...item,
			questions: item.questions.filter((q) => q.id !== questionId),
		};
		updateQuizItem(updatedItem);
		if (updatedItem.questions.length === 0) {
			setContentAdded(false);
		}
	};

	return (
		<div className="flex flex-col border border-lightGray rounded-lg p-4 mt-4">
			<div className="flex justify-between items-center">
				<div className="flex gap-3">
					<h4 className="text-lg font-semibold">{item.quizTitle}</h4>
					<button onClick={deleteQuizItem}>
						<img src={deleteicon} alt="Delete" />
					</button>
				</div>

				{!contentAdded && !showAddQuestion && (
					<IconButton
						text="Question"
						icon={addicon}
						onClick={() => {
							setShowAddQuestion(true);
							setShowContent(true);
						}}
					/>
				)}
				{(contentAdded || showAddQuestion) && (
					<button onClick={() => setShowContent(!showContent)}>
						{showContent ? (
							<img src={arrowup} alt="Collapse" />
						) : (
							<img src={arrowdown} alt="Expand" />
						)}
					</button>
				)}
			</div>

			{showContent && (
				<>
					<Divider />

					{showAddQuestion && !contentAdded && (
						<AddContentButton onContentAdded={handleContentAdded} />
					)}

					{item?.questions?.length > 0 && (
						<>
							<div className="flex justify-between items-center">
								<h4 className="text-lg font-semibold">Questions</h4>
								<IconButton
									text="Add Question"
									icon={addicon}
									onClick={() => {
										setShowAddContent(true);
									}}
								/>
							</div>
							<Divider />
						</>
					)}

					{showEditForm && (
						<QuestionForm
							questionData={item?.questions[editQuestionIndex]}
							contentType={contentType}
							onSave={handleSaveEdit}
							onCancel={() => {
								setShowEditForm(false);
								setEditQuestionIndex(null);
							}}
						/>
					)}

					{!showEditForm && (
						<>
							{item?.questions?.map((question, index) => (
								<div
									key={index}
									className="flex gap-3 items-center mt-2"
								>
									<p>Question {index + 1}:</p>
									<p className="text-lightGray">{question.type}</p>
									<div className="flex gap-2">
										<button onClick={() => handleEditQuestion(index)}>
											<img src={editicon} alt="Edit" />
										</button>
										<button
											onClick={() =>
												handleDeleteQuestion(question.id)
											}
										>
											<img src={deleteicon} alt="Delete" />
										</button>
									</div>
								</div>
							))}
						</>
					)}

					{showAddContent && !showEditForm && (
						<AddContentButton
							onContentAdded={handleContentAdded}
							onContentDeleted={() => setShowAddContent(false)}
						/>
					)}
				</>
			)}
		</div>
	);
};

const AddContentButton = ({
	onContentAdded,
	existingContent,
	onContentDeleted,
}) => {
	const [showForm, setShowForm] = useState(false);
	const [contentType, setContentType] = useState(null);

	const handleAdd = (content) => {
		onContentAdded(content);
		resetState();
	};

	const handleCancel = () => {
		resetState();
	};

	const resetState = () => {
		setShowForm(false);
		setContentType(null);
	};

	return (
		<div>
			{showForm ? (
				<QuestionForm
					questionData={existingContent}
					onSave={handleAdd}
					onCancel={handleCancel}
					contentType={contentType}
				/>
			) : (
				<div className="flex gap-2 mt-4 justify-center">
					<IconButton
						onClick={() => {
							setShowForm(true);
							setContentType("multipleChoice");
						}}
						text="Multiple Choice"
						className="border-primaryBlue"
						icon={texticon}
					/>
					<IconButton
						onClick={() => {
							setShowForm(true);
							setContentType("trueFalse");
						}}
						text="True/False"
						icon={videoicon}
					/>
				</div>
			)}
		</div>
	);
};
