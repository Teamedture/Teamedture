import React, {
	useEffect,
	useState,
	useContext,
	useCallback,
	useRef,
} from "react";
import { userContext } from "../context/UserContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import CourseDetailsLayout from "../layouts/CourseDetailsLayout";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import chatactive from "/icons/chat-active.svg";
import lessons from "/icons/lessons.svg";
import topics from "/icons/topics.svg";
import video from "/icons/video.svg";
import book from "/icons/book.svg";
import danger from "/icons/danger.svg";
import quiz from "/quiz.svg";
import tutor from "/tutor-profile.svg";
import certificate from "/icons/certificate.svg";
import certificategif from "/certificate-gif.gif";
import { SuccessModal, ScoreModal } from "../components/popups/Modal";
import {
	ContentModule,
	QuizModule,
	QuizSidebar,
} from "../components/courses/CourseModule";
import ProgressBar from "../components/ProgressBar";
import { useApi } from "../utils/customHooks";
import { SpinnerLoader } from "../components/Loader";
import { Divider } from "../components/Dividers";
import VideoComponent from "../components/courses/VideoComponent";
import axios from "axios";
// import CertificateGenerator from "../components/courses/CertificateComponent";
import Certificate from "../components/courses/CertificateComponent";

const CourseContent = () => {
	const { id } = useParams();
	const {
		loading: scoreLoading,
		setLoading,
		error,
		setError,
		courses: allCourses,
		token,
		user,
		role,
		firstName,
		lastName,
	} = useContext(userContext);

	const {
		data: courseContents,
		loading: courseContentsLoading,
		error: courseContentsError,
	} = useApi(`https://edture.onrender.com/users/student/courses/${id}`, token);

	const {
		data: quizzes,
		loading: quizzesLoading,
		error: quizzesError,
	} = useApi(`https://edture.onrender.com/courses/${id}/quiz`, token);

	const course = courseContents;
	const courseLessonsData = course?.lessons || [];

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const [expandAll, setExpandAll] = useState(false);
	const [modulesState, setModulesState] = useState({});
	const [activeTab, setActiveTab] = useState("study");
	const [selectedTopic, setSelectedTopic] = useState(null);
	const [showQuizContent, setShowQuizContent] = useState(false);
	const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [responses, setResponses] = useState({});
	const [showScore, setShowScore] = useState(false);
	const [showCertificate, setShowCertificate] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [score, setScore] = useState(null);
	const [isMarking, setIsMarking] = useState(false);
	const [completedTopics, setCompletedTopics] = useState([]);

	const navigate = useNavigate();

	const handleModuleToggle = useCallback((index, isOpen) => {
		setModulesState((prev) => {
			const updatedState = { ...prev, [index]: isOpen };

			const allExpanded = Object.values(updatedState).every(
				(state) => state
			);
			const anyExpanded = Object.values(updatedState).some((state) => state);

			setExpandAll(allExpanded || (!anyExpanded && false));

			return updatedState;
		});
	}, []);

	const handleTopicSelect = (topic) => {
		setSelectedTopic(topic);
		setShowQuizContent(false);
	};

	const handleQuizSelect = () => {
		setShowQuizContent(true);
		setActiveTab("quiz");
	};

	const handlePreviousQuestion = () => {
		if (currentQuizIndex > 0) {
			setCurrentQuizIndex(currentQuizIndex - 1);
			setSelectedAnswer(
				responses[quizzes[0]?.questions[currentQuizIndex - 1]?.id] || null
			);
		}
	};

	const handleNextQuestion = () => {
		const totalQuestions = quizzes[0]?.questions?.length || 0;
		if (currentQuizIndex < totalQuestions - 1) {
			const nextIndex = currentQuizIndex + 1;
			setCurrentQuizIndex(nextIndex);
			setSelectedAnswer(
				responses[quizzes[0]?.questions[nextIndex]?.id] || null
			);
		}
	};

	const handleAnswerSelect = (answerId) => {
		const currentQuestion = quizzes[0]?.questions[currentQuizIndex];
		const selectedAnswer = currentQuestion?.answers.find(
			(answer) => answer.id === answerId
		);

		setResponses((prevResponses) => ({
			...prevResponses,
			[currentQuestion.id]: selectedAnswer?.option,
		}));
		setSelectedAnswer(answerId);
	};

	const calculateScore = async () => {
		setLoading(true);
		try {
			const quizId = quizzes[0]?.id;

			const answersPayload = Object.entries(responses).map(
				([questionId, answerText]) => ({
					questionId,
					answer: answerText,
				})
			);

			const response = await axios.post(
				`https://edture.onrender.com/courses/${id}/quiz/${quizId}/score`,
				{ answers: answersPayload },
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const scoreData = response.data;
			const roundedScore = Math.round(scoreData.data.score.percentScore);
			setScore(roundedScore);
			setLoading(false);
			setShowScore(true);
		} catch (error) {
			console.error("Error calculating score:", error);
			setLoading(false);
		}
	};

	const handleShowSuccess = () => {
		setShowSuccess(true);
		setShowScore(false);
	};

	const handleBackToCourses = () => {
		navigate("/courses");
	};

	const handleShowCerificate = () => {
		setShowCertificate(true);
		setShowSuccess(false);
	};

	const markTopicAsCompleted = async () => {
		setIsMarking(true);
		try {
			await axios.put(
				`https://edture.onrender.com/users/enrolled-courses/${id}/topics/${selectedTopic._id}/complete`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setSelectedTopic((prevTopic) => ({
				...prevTopic,
				isCompleted: !prevTopic.isCompleted,
			}));
			setIsMarking(false);
		} catch (error) {
			console.error("Error updating topic completion status:", error);
			setIsMarking(false);
		}
	};

	const calculateTotalDuration = () => {
		let totalSeconds = 0;

		courseLessonsData?.forEach((lesson) => {
			lesson.topics.forEach((topic) => {
				if (topic.contentType === "video" && topic.videoDurationInSeconds) {
					totalSeconds += topic.videoDurationInSeconds;
				}
			});
		});

		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);

		return { hours, minutes };
	};

	const { hours, minutes } = calculateTotalDuration();

	const videoUrl =
		selectedTopic?.contentType === "video" ? selectedTopic.videoUrl : null;

	const textContent =
		selectedTopic?.contentType === "text" ? selectedTopic.description : null;

	function formatTextContent(text) {
		if (!text) return "";

		const sentences = text
			.split(".")
			.map((sentence) => sentence.trim())
			.filter(Boolean);

		const paragraphs = [];
		let currentParagraph = [];
		let lineCount = 0;

		sentences.forEach((sentence) => {
			const sentenceLines = sentence.split("\n").length;

			if (lineCount + sentenceLines > 8) {
				paragraphs.push(currentParagraph.join(". ") + ".");
				currentParagraph = [];
				lineCount = 0;
			}

			currentParagraph.push(sentence);
			lineCount += sentenceLines;
		});

		if (currentParagraph.length > 0) {
			paragraphs.push(currentParagraph.join(". ") + ".");
		}

		return paragraphs.join("\n\n");
	}

	const formattedText = formatTextContent(textContent);
	console.log(formattedText);

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current && courseLessonsData.length > 0) {
			const firstTopic = courseLessonsData[0].topics[0];
			setSelectedTopic(firstTopic);
			isFirstRender.current = false;
		}
	}, [courseLessonsData]);

	useEffect(() => {
		if (selectedTopic) {
			if (selectedTopic.contentType === "video") {
				setActiveTab("discuss");
			} else if (selectedTopic.contentType === "text") {
				setActiveTab("study");
			}
		}
	}, [selectedTopic]);

	const QuizContent = ({
		quiz,
		currentQuizIndex,
		onAnswerSelect,
		onNextQuestion,
		onPreviousQuestion,
		handleQuizSubmit,
	}) => {
		const currentQuiz = quiz?.questions?.[currentQuizIndex];
		const totalQuestions = quiz?.questions?.length || 0;
		const isLastQuestion = currentQuizIndex === totalQuestions - 1;

		return (
			<div>
				<div className="flex items-center gap-5 mb-4">
					<h2 className="text-3xl font-bold capitalize">{quiz?.title}</h2>
					<span className="rounded-full px-3 py-1 font-medium text-darkBlue bg-secondaryHoverBlue">
						Quiz
					</span>
				</div>
				<Divider />
				<div className="pt-5">
					<div className="flex flex-col gap-3 items-center">
						<span className="text-sm text-lightGray text-center">
							Question {currentQuizIndex + 1}
						</span>
						<h5 className="font-trap-grotesk text-xl capitalize text-center font-semibold">
							{currentQuiz?.questionText} ?
						</h5>
					</div>

					{currentQuiz?.answers?.map((option, index) => (
						<div key={index} className="flex gap-4 justify-start">
							<input
								type="radio"
								name="quizOption"
								value={option.id}
								checked={responses[currentQuiz?.id] === option.option}
								onChange={() => onAnswerSelect(option.id)}
							/>
							<label className="font-trap-grotesk text-lg capitalize">
								{option.option}
							</label>
						</div>
					))}
					<div className="flex gap-4 mt-4 justify-between items-center">
						{currentQuizIndex > 0 && (
							<SecondaryButton
								onClick={onPreviousQuestion}
								text="Previous"
							/>
						)}
						<div className="flex justify-between self-end">
							<PrimaryButton
								onClick={
									isLastQuestion ? handleQuizSubmit : onNextQuestion
								}
								text={isLastQuestion ? "Check Score" : "Next"}
								disabled={selectedAnswer === null}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderContent = () => {
		if (activeTab === "quiz" && showQuizContent) {
			const quiz = quizzes[0];
			return (
				<QuizContent
					quiz={quiz}
					currentQuizIndex={currentQuizIndex}
					onAnswerSelect={handleAnswerSelect}
					onNextQuestion={handleNextQuestion}
					onPreviousQuestion={handlePreviousQuestion}
					handleQuizSubmit={calculateScore}
				/>
			);
		}

		if (activeTab === "study") {
			return (
				<div className="">
					<div
						style={{ whiteSpace: "pre-line" }}
						className="font-trap-grotesk text-lg"
					>
						{formattedText}
					</div>
				</div>
			);
		}

		if (activeTab === "discuss") {
			return (
				<div className="flex flex-col gap-4">
					<p className="font-trap-grotesk text-lg">
						Visit the community page to browse topics and discussions.
						Post a question, start a new discussion, or join an existing
						conversation!
					</p>
					<div>
						<Link
							to={`/courses/${id}/chat`}
							className="flex gap-2 font-trap-grotesk text-primaryBlue font-medium items-center justify-start"
						>
							<img src={chatactive} alt="Chat" />
							<span className="font-trap-grotesk">Chat</span>
						</Link>
					</div>
				</div>
			);
		}

		if (activeTab === "resources") {
			const hasResources = courseLessonsData?.some((lesson) =>
				lesson.topics.some(
					(topic) => topic.downloadableMaterials?.length > 0
				)
			);

			if (hasResources) {
				return courseLessonsData.map((lesson, index) => (
					<div key={index} className="">
						{lesson.topics.map((topic, i) =>
							topic.downloadableMaterials?.map((resource, j) => (
								<div
									key={`${i}-${j}`}
									className="flex gap-4 justify-start"
								>
									<h4 className="text-lg">{topic.title}:</h4>
									<a
										className="text-primaryBlue underline font-trap-grotesk text-lg"
										href={resource.url}
										rel="noopener noreferrer"
									>
										{resource.name}
									</a>
								</div>
							))
						)}
					</div>
				));
			} else {
				return (
					<p className="text-lightGray text-lg font-medium font-trap-grotesk">
						No resources available.
					</p>
				);
			}
		}

		return null;
	};


	return (
		<div>
			{(courseContentsLoading || scoreLoading) && <SpinnerLoader />}
			<CourseDetailsLayout>
				<div className="flex px-12 justify-between">
					<div className="bg-white flex flex-col pt-8 pr-5 border-r-[0.5px] border-r-lightGray w-[30%] h-full gap-3 min-h-screen sticky top-0 bottom-0 z-20">
						<div className="flex justify-between items-center gap-4">
							<h5 className="text-lg font-trap-grotesk font-semibold">
								Course Content
							</h5>
						</div>
						<div className="h-full ">
							{courseLessonsData?.map((lesson, index) => (
								<ContentModule
									key={index}
									lessonTitle={lesson.title}
									lessonItems={lesson.topics}
									isExpanded={modulesState[index] || false}
									onToggle={(isOpen) =>
										handleModuleToggle(index, isOpen)
									}
									onTopicSelect={handleTopicSelect}
									onMarkAsCompleted={markTopicAsCompleted}
								/>
							))}
							{quizzes?.length > 0 && (
								<QuizSidebar
									quizTitle="Quiz"
									quizItems={quizzes}
									isExpanded={false}
									onToggle={() => {}}
									onQuizSelect={handleQuizSelect}
								/>
							)}
						</div>
					</div>

					<div className="p-8 w-full">
						{!showQuizContent && (
							<div className="flex justify-between items-center py-2">
								<div></div>
								<SecondaryButton
									text={
										selectedTopic?.isCompleted
											? "Completed"
											: isMarking
											? "Marking as completed..."
											: "Mark as completed"
									}
									onClick={markTopicAsCompleted}
								/>
							</div>
						)}

						{!showQuizContent && videoUrl && (
							<VideoComponent url={videoUrl} />
						)}

						{!showQuizContent && (
							<>
								<div className="flex gap-14 items-center px-6 p-1 text-center relative">
									{!videoUrl && (
										<button
											className={`hover:text-primaryBlue font-trap-grotesk ${
												activeTab === "study"
													? "text-primaryBlue"
													: ""
											}`}
											onClick={() => setActiveTab("study")}
										>
											Study
										</button>
									)}
									<button
										className={`hover:text-primaryBlue font-trap-grotesk ${
											activeTab === "discuss"
												? "text-primaryBlue"
												: ""
										}`}
										onClick={() => setActiveTab("discuss")}
									>
										Discuss
									</button>
									<button
										className={`hover:text-primaryBlue font-trap-grotesk ${
											activeTab === "resources"
												? "text-primaryBlue"
												: ""
										}`}
										onClick={() => setActiveTab("resources")}
									>
										Resources
									</button>
									<div
										className="absolute -bottom-[8.5px] rounded left-0 h-[1.5px] w-[12%] bg-primaryBlue transition-all duration-300"
										style={{
											transform: videoUrl
												? activeTab === "discuss"
													? "translateX(2%)"
													: activeTab === "resources"
													? "translateX(100%)"
													: "translateX(0)"
												: activeTab === "discuss"
												? "translateX(80%)"
												: activeTab === "resources"
												? "translateX(188%)"
												: "translateX(0)",
										}}
									></div>
								</div>
								<Divider />
							</>
						)}

						<div className="py-3 flex flex-col gap-3">
							{renderContent()}
						</div>
					</div>
				</div>
			</CourseDetailsLayout>
			{showScore && (
				<ScoreModal
					content={"You scored"}
					score={`${score}`}
					allowClose={false}
					onPass={handleShowSuccess}
					onFail={handleBackToCourses}
				/>
			)}
			{showSuccess && (
				<SuccessModal
					heading={"Congratulations on completing this course"}
					buttonText={"Download certificate"}
					allowClose={false}
					onConfirm={handleShowCerificate}
					img={certificategif}
					imageStyling="w-48"
				/>
			)}
			{showCertificate && (
				<Certificate
					firstName={firstName}
					lastName={lastName}
					course={course.title}
					onClose={handleBackToCourses}
				/>
			)}
		</div>
	);
};

export default CourseContent;
