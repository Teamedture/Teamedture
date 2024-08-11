import React, { useState, useContext } from "react";
import { AddQuizInput, QuizItem } from "./QuizItem";
import { IconButton, PrimaryButton } from "../Button";
import addicon from "/icons/add-course.svg";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { userContext } from "../../context/UserContext";
import { SuccessModal } from "../popups/Modal";
import successgif from "/success-gif.gif";
import { SpinnerLoader } from "../Loader";

const QuizCreation = () => {
	const { id: courseId } = useParams();
	const { token, loading, setLoading } = useContext(userContext);
	const [quiz, setQuiz] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showAddQuizInput, setShowAddQuizInput] = useState(false);

	const navigate = useNavigate();

	const addQuiz = (newQuiz) => {
		setQuiz(newQuiz);
		setShowAddQuizInput(false);
	};

	const updateQuizItem = (updatedQuiz) => {
		setQuiz(updatedQuiz);
	};

	const deleteQuizItem = () => {
		setQuiz(null);
	};

	const allQuestionsHaveAnswers = quiz?.questions?.length > 0;

	const navigateToCourses = () => {
		navigate(`/courses/${courseId}`);
	};

	const handleCreateQuiz = async () => {
		const url = `https://edture.onrender.com/courses/${courseId}/quiz`;

		const quizData = {
			title: quiz.quizTitle,
			questions: quiz.questions.map((q) => ({
				questionText: q.question,
				answers: Object.entries(q.answers).map(([key, value]) => ({
					option: value,
					isCorrect: key === q.correctAnswer,
				})),
			})),
		};

		setLoading(true);
		try {
			const response = await axios.post(url, quizData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (response.status === 201) {
				console.log("Quiz created successfully", response.data);
				setShowModal(true);
				setLoading(false);
			} else {
				console.error("Failed to create quiz", response);
				setLoading(false);
			}
		} catch (error) {
			console.error("Error:", error);
			setLoading(false);
		}
	};

	return (
		<div>
			{loading && <SpinnerLoader />}
			<div className="flex flex-col gap-3">
				<h3 className="text-xl font-semibold mb-2 text-primaryBlack">
					Create Quizzes
				</h3>
				<p className="font-trap-grotesk text-lg">
					Use your outline to structure content and label clearly, create
					quizzes for your courses
				</p>
			</div>
			<div>
				{quiz && (
					<QuizItem
						item={quiz}
						updateQuizItem={updateQuizItem}
						deleteQuizItem={deleteQuizItem}
					/>
				)}
			</div>
			<div className="flex flex-col gap-2 mt-4">
				{showAddQuizInput && (
					<div className="border p-4 border-lightGray rounded-lg">
						<AddQuizInput
							addQuiz={addQuiz}
							onCancel={() => setShowAddQuizInput(false)}
						/>
					</div>
				)}
				<div className="mt-4 flex justify-between">
					{!quiz && (
						<IconButton
							icon={addicon}
							text="Quiz"
							onClick={() => setShowAddQuizInput(!showAddQuizInput)}
						/>
					)}
					{allQuestionsHaveAnswers && (
						<PrimaryButton
							text={"Create Quiz"}
							onClick={handleCreateQuiz}
						/>
					)}
				</div>
			</div>
			{showModal && (
				<SuccessModal
					heading={"Your quiz has been created successfully"}
					buttonText={"Go to course"}
					img={successgif}
					imageStyling="w-[60%]"
					allowClose={false}
					onConfirm={navigateToCourses}
				/>
			)}
		</div>
	);
};

export default QuizCreation;
