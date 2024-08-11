import React, { useEffect, useState, useContext, useCallback } from "react";
import { userContext } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import CourseDetailsLayout from "../layouts/CourseDetailsLayout";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import lessons from "/icons/lessons.svg";
import topics from "/icons/topics.svg";
import video from "/icons/video.svg";
import book from "/icons/book.svg";
import danger from "/icons/danger.svg";
import medal from "/icons/medal-star.svg";
import quiz from "/quiz.svg";
import certificateicon from "/icons/certificate.svg";
import deleteicon from "/icons/delete.svg";
import ratingsicon from "/icons/ratings.svg";
import RecommendedCourses from "../components/courses/RecommendedCourses";
import { CourseModule, QuizModule } from "../components/courses/CourseModule";
import ProgressBar from "../components/ProgressBar";
import { useApi } from "../utils/customHooks";
import { SpinnerLoader } from "../components/Loader";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatPriceWithCommas } from "../utils/utils";
import EditCourse from "../components/courses/EditCourse";
import Certificate from "../components/courses/CertificateComponent";
import { ConfirmationModal } from "../components/popups/Modal";
import axios from "axios";
import { formatUpdatedAt } from "../utils/utils";

const CourseDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const {
		courses: allCourses,
		token,
		user,
		role,
		firstName,
		lastName,
		loading,
		setLoading,
	} = useContext(userContext);

	const [showCertificate, setShowCertificate] = useState(false);
	const [showDelete, setShowDelete] = useState(false);

	const handleShowCertificate = () => {
		setShowCertificate(true);
	};

	const handleCloseCertificate = () => {
		setShowCertificate(false);
	};

	const showDeleteModal = () => {
		setShowDelete(true);
	};

	const closeDeleteModal = () => {
		setShowDelete(false);
	};

	const handleDelete = async () => {
		setLoading(true);

		try {
			await axios.delete(`https://edture.onrender.com/courses/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			navigate("/courses");
			window.location.reload();
		} catch (error) {
			console.error("Failed to delete course:", error);
		} finally {
			setLoading(false);
		}
	};

	const {
		data: courseDetails,
		loading: courseDetailsLoading,
		error: courseDetailsError,
	} = useApi(`https://edture.onrender.com/courses/${id}`, token);

	const {
		data: enrolledCoursesDetails,
		loading: enrolledCoursesLoading,
		error: enrolledCoursesError,
	} = useApi(
		role === "STUDENT"
			? `https://edture.onrender.com/users/student/courses/${id}`
			: null,
		token
	);

	const {
		data: quizzes,
		loading: quizzesLoading,
		error: quizzesError,
	} = useApi(`https://edture.onrender.com/courses/${id}/quiz`, token);

	const course = courseDetails || enrolledCoursesDetails;
	const courseLessonsData = course?.lessons || [];
	const recommendedCourses = allCourses?.courses?.slice(0, 4);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const isTutor = user?.role === "TUTOR";

	return (
		<>
			{(courseDetailsLoading ||
				quizzesLoading ||
				enrolledCoursesLoading ||
				loading) && <SpinnerLoader />}
			{courseDetailsError && <p>{courseDetailsError}</p>}
			<CourseDetailsLayout>
				{isTutor ? (
					<TutorHeader
						selectedCourse={course}
						showDeleteModal={showDeleteModal}
					/>
				) : (
					<StudentHeader
						selectedCourse={course}
						courseInProgress={enrolledCoursesDetails}
						handleShowCertificate={handleShowCertificate}
					/>
				)}
				{isTutor ? (
					<TutorContent
						selectedCourse={courseLessonsData}
						quizzes={quizzes}
					/>
				) : (
					<StudentContent
						selectedCourse={courseLessonsData}
						recommendedCourse={recommendedCourses}
					/>
				)}
				{showCertificate && (
					<Certificate
						firstName={firstName}
						lastName={lastName}
						course={course.title}
						onClose={handleCloseCertificate}
					/>
				)}
				{showDelete && (
					<ConfirmationModal
						heading={"Delete Course"}
						onConfirm={handleDelete}
						content={"Are you sure you want to delete this course"}
						confirmText={"Yes"}
						cancelText={"No"}
						onClose={closeDeleteModal}
					/>
				)}
			</CourseDetailsLayout>
		</>
	);
};

const StudentHeader = ({
	selectedCourse,
	courseInProgress,
	handleShowCertificate,
}) => (
	<div className="bg-darkBlue text-white pt-8 font-trap-grotesk">
		<div className="flex relative container-wrapper font-trap-grotesk">
			<div className="w-3/5 flex flex-col p-12">
				<h1 className="font-bold text-5xl mb-4">{selectedCourse?.title}</h1>
				<p className="font-trap-grotesk text-sm mb-2 whitespace-pre-line">
					{selectedCourse?.description}
				</p>
				<div className="flex gap-2 mb-2">
					<div className="flex gap-1 items-center">
						<img src={ratingsicon} alt="Ratings" />
						<span className="font-trap-grotesk">4.5 •</span>
					</div>
					<span className="font-trap-grotesk">
						Last updated:{" "}
						{selectedCourse?.updatedAt
							? formatUpdatedAt(selectedCourse.updatedAt)
							: ""}
					</span>
					{selectedCourse?.certificateAvailable && (
						<span className="font-trap-grotesk">
							Certificate available
						</span>
					)}
				</div>
				<div>
					<p className="font-trap-grotesk text-sm mb-2">
						Instructor: {selectedCourse?.instructorName}
					</p>
				</div>
			</div>
			<CourseModal
				course={selectedCourse}
				courseInProgress={courseInProgress}
				handleShowCertificate={handleShowCertificate}
			/>
		</div>
	</div>
);

const TutorHeader = ({ selectedCourse, showDeleteModal }) => (
	<div className="bg-darkBlue text-white pt-8 font-trap-grotesk">
		<div className="flex relative container-wrapper w-full font-trap-grotesk">
			<div className="w-3/5 flex flex-col p-12">
				<h1 className="font-bold text-5xl mb-4">{selectedCourse?.title}</h1>
				<p className="font-trap-grotesk text-sm mb-2 whitespace-pre-line">
					{selectedCourse?.description}
				</p>
				<div className="flex gap-2 mb-2">
					<div className="flex gap-1 items-center">
						<img src={ratingsicon} alt="Ratings" />
						<span className="font-trap-grotesk">4.5 •</span>
					</div>
					<span className="font-trap-grotesk">
						Last updated:{" "}
						{selectedCourse?.updatedAt
							? formatUpdatedAt(selectedCourse.updatedAt)
							: ""}
					</span>
					{selectedCourse?.certificateAvailable && (
						<span className="font-trap-grotesk">
							Certificate available
						</span>
					)}
				</div>
				<div>
					<p className="font-trap-grotesk text-sm mb-2">
						Instructor: {selectedCourse?.instructorName}
					</p>
				</div>
			</div>
			<TutorModal
				course={selectedCourse}
				showDeleteModal={showDeleteModal}
			/>
		</div>
	</div>
);

const StudentContent = ({ selectedCourse, recommendedCourse }) => {
	const [expandAll, setExpandAll] = useState(false);
	const [modulesState, setModulesState] = useState({});

	const handleExpandAllClick = useCallback(() => {
		const newExpandAll = !expandAll;
		setExpandAll(newExpandAll);
		setModulesState(
			selectedCourse.reduce((acc, _, index) => {
				acc[index] = newExpandAll;
				return acc;
			}, {})
		);
	}, [expandAll, selectedCourse]);

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

	const calculateTotalDuration = () => {
		let totalSeconds = 0;

		selectedCourse?.forEach((lesson) => {
			lesson.topics.forEach((topic) => {
				if (topic.contentType === "video" && topic.videoDurationInSeconds) {
					totalSeconds += topic.videoDurationInSeconds;
				}
			});
		});

		if (totalSeconds === 0) {
			return null;
		}

		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = Math.floor(totalSeconds % 60);

		return { hours, minutes, seconds };
	};

	const duration = calculateTotalDuration() || {};
	const { hours = 0, minutes = 0, seconds = 0 } = duration;

	const totalTopics = selectedCourse?.reduce(
		(acc, lesson) => acc + lesson.topics.length,
		0
	);
	const topicLabel = totalTopics === 1 ? "Topic" : "Topics";

	const totalLessons = selectedCourse?.length;
	const lessonLabel = totalLessons === 1 ? "Lesson" : "Lessons";

	return (
		<>
			<div className="flex flex-col gap-10 py-8 pl-14 w-3/5 relative">
				<div>
					<h5 className="text-xl font-trap-grotesk font-semibold">
						Course Content
					</h5>
					<div className="flex flex-col gap-3">
						<div className="flex justify-between items-center">
							<div>
								<span className="font-trap-grotesk">
									{selectedCourse?.length} {lessonLabel} •
								</span>
								<span className="font-trap-grotesk">
									{" "}
									{selectedCourse?.reduce(
										(acc, lesson) => acc + lesson.topics.length,
										0
									)}{" "}
									{topicLabel}{" "}
								</span>
								{(hours > 0 || minutes > 0 || seconds > 0) && (
									<span className="font-trap-grotesk">
										• {hours > 0 ? `${hours}h ` : ""}
										{minutes}m {seconds}s total length
									</span>
								)}
							</div>
							<SecondaryButton
								onClick={handleExpandAllClick}
								className="font-trap-grotesk text-primary"
								text={expandAll ? "Collapse All" : "Expand All"}
							/>
						</div>
						<div>
							{selectedCourse?.map((lesson, index) => (
								<CourseModule
									key={index}
									lessonTitle={lesson.title}
									lessonItems={lesson.topics}
									isExpanded={modulesState[index] || false}
									onToggle={(isOpen) =>
										handleModuleToggle(index, isOpen)
									}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
			<RecommendedCourses
				courses={recommendedCourse}
				styleClass="px-12 py-10"
				heading={"Similar Courses"}
			/>
		</>
	);
};

const TutorContent = ({ selectedCourse, quizzes }) => {
	const [expandAll, setExpandAll] = useState(false);
	const [modulesState, setModulesState] = useState({});

	const handleExpandAllClick = useCallback(() => {
		const newExpandAll = !expandAll;
		setExpandAll(newExpandAll);
		setModulesState(
			selectedCourse.reduce((acc, _, index) => {
				acc[index] = newExpandAll;
				return acc;
			}, {})
		);
	}, [expandAll, selectedCourse]);

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

	const calculateTotalDuration = () => {
		let totalSeconds = 0;

		selectedCourse?.forEach((lesson) => {
			lesson.topics.forEach((topic) => {
				if (topic.contentType === "video" && topic.videoDurationInSeconds) {
					totalSeconds += topic.videoDurationInSeconds;
				}
			});
		});

		if (totalSeconds === 0) {
			return null;
		}

		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = Math.floor(totalSeconds % 60);

		return { hours, minutes, seconds };
	};

	const duration = calculateTotalDuration() || {};
	const { hours = 0, minutes = 0, seconds = 0 } = duration;

	const totalTopics = selectedCourse?.reduce(
		(acc, lesson) => acc + lesson.topics.length,
		0
	);
	const topicLabel = totalTopics === 1 ? "Topic" : "Topics";

	const totalLessons = selectedCourse?.length;
	const lessonLabel = totalLessons === 1 ? "Lesson" : "Lessons";

	return (
		<div className="flex flex-col gap-10 py-8 pl-14 w-3/5">
			<div className="font-trap-grotesk">
				<div className="flex flex-col gap-3 border border-lightGray rounded-lg p-4 text-darkGray">
					<h4 className="text-xl font-trap-grotesk font-semibold">
						Manage Your Course
					</h4>
					<div className="grid grid-cols-2 gap-3">
						<div className="flex gap-2 items-center">
							<img src={lessons} alt="Lessons Icon" className="w-5" />
							<p className="font-trap-grotesk">Edit Lessons</p>
						</div>
						<div className="flex gap-2 items-center">
							<img src={video} alt="Video Icon" className="w-5" />
							<p className="font-trap-grotesk">Upload Videos</p>
						</div>
						<div className="flex gap-2 items-center">
							<img src={quiz} alt="Quiz Icon" className="w-5" />
							<p className="font-trap-grotesk">Create Quizzes</p>
						</div>
						<div className="flex gap-2 items-center">
							<img
								src={certificateicon}
								alt="Certificate Icon"
								className="w-5"
							/>
							<p className="font-trap-grotesk">Manage Certificates</p>
						</div>
					</div>
				</div>
			</div>
			<div>
				<h5 className="text-xl font-trap-grotesk font-semibold">
					Course Content
				</h5>
				<div className="flex flex-col gap-3">
					<div className="flex justify-between items-center">
						<div>
							<span className="font-trap-grotesk">
								{selectedCourse?.length} {lessonLabel} •
							</span>
							<span className="font-trap-grotesk">
								{" "}
								{selectedCourse?.reduce(
									(acc, lesson) => acc + lesson.topics.length,
									0
								)}{" "}
								{topicLabel}{" "}
							</span>
							{(hours > 0 || minutes > 0 || seconds > 0) && (
								<span className="font-trap-grotesk">
									• {hours > 0 ? `${hours}h ` : ""}
									{minutes}m {seconds}s total length
								</span>
							)}
						</div>
						<SecondaryButton
							onClick={handleExpandAllClick}
							className="font-trap-grotesk text-primary"
							text={expandAll ? "Collapse All" : "Expand All"}
						/>
					</div>
					<div>
						{selectedCourse?.map((lesson, index) => (
							<CourseModule
								key={index}
								lessonTitle={lesson.title}
								lessonItems={lesson.topics}
								isExpanded={modulesState[index] || false}
								onToggle={(isOpen) => handleModuleToggle(index, isOpen)}
							/>
						))}
						{quizzes?.length > 0 && (
							<QuizModule
								quizTitle="Quiz"
								quizItems={quizzes}
								isExpanded={false}
								onToggle={() => {}}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const CourseModal = ({ course, courseInProgress, handleShowCertificate }) => {
	const { addItemToCart } = useCart();

	const navigate = useNavigate();

	const handleAddToCart = async () => {
		const itemAdded = await addItemToCart(course);
		if (itemAdded) {
			toast.success("Course added to cart!");
		} else {
			toast.error("This course already in your cart!");
		}
	};

	const handleBuyNow = async () => {
		try {
			const itemAdded = await addItemToCart(course);
			if (itemAdded) {
				navigate("/cart");
			} else {
				await addItemToCart(course);
				navigate("/cart");
			}
		} catch (error) {
			console.error("Failed to add course to cart:", error);
			toast.error("Failed to add course to cart!");
		}
	};

	const navigateToLms = () => {
		navigate(`/courses/course-content/${courseInProgress?._id}`);
	};

	return (
		<div className="fixed top-32 right-14 p-4 w-full max-w-[400px] max-h-[90vh] bg-white shadow-lg z-20 rounded-lg font-trap-grotesk">
			<div className="h-[200px]">
				<img
					src={course?.image || courseInProgress?.image}
					className="w-full h-full mb-4 object-cover rounded-md"
					alt="Course"
				/>
			</div>
			{courseInProgress?.enrollmentData ? (
				<div className="py-4 flex flex-col gap-2">
					<ProgressBar
						progress={courseInProgress?.enrollmentData?.progress}
					/>
					<p className="font-trap-grotesk text-lightGray text-sm">
						{courseInProgress?.enrollmentData?.progress}% complete
					</p>
					{courseInProgress?.enrollmentData.progress === 100 ? (
						<div className="flex flex-col gap-3">
							<PrimaryButton
								text={"Resume Learning"}
								className="w-full"
								onClick={navigateToLms}
							/>
							<div
								className="border rounded-md text-primaryBlack text-sm flex gap-3 items-center border-lightGray cursor-pointer"
								onClick={handleShowCertificate}
							>
								<img
									src={medal}
									className="bg-green p-3 rounded-tl rounded-bl"
								/>
								<span className="font-trap-grptesk text-primaryBlack opacity-80">
									Download certificate
								</span>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-3">
							<PrimaryButton
								text={"Resume Learning"}
								className="w-full"
								onClick={navigateToLms}
							/>
							<div className="border rounded-md text-primaryBlack text-sm flex gap-3 items-center border-lightGray">
								<img
									src={danger}
									className="bg-warning p-3 rounded-tl rounded-bl"
								/>
								<span className="font-trap-grptesk text-primaryBlack opacity-80">
									Complete all lessons to get your certificate
								</span>
							</div>
						</div>
					)}
				</div>
			) : (
				<>
					<p className="font-semibold text-2xl pt-2 text-primaryBlack font-trap-grotesk">
						<span className="font-trap-grotesk font-semibold text-xl pr-1">
							{course?.currency || courseInProgress?.currency}
						</span>
						{formatPriceWithCommas(course?.price) ||
							formatPriceWithCommas(courseInProgress?.price)}
					</p>
					<div className="flex flex-col gap-4 py-2">
						<PrimaryButton
							text={"Add to cart"}
							className="w-full"
							onClick={handleAddToCart}
						/>
						<SecondaryButton
							text={"Buy Now"}
							className="w-full"
							onClick={handleBuyNow}
						/>
					</div>
				</>
			)}
			<div className="text-primaryBlack py-2">
				<h5 className="font-bold font-trap-grotesk text-lg">
					Course includes:
				</h5>
				<div className="flex flex-col gap-2 py-2 text-sm">
					<div className="flex gap-5 w-4/5 justify-start">
						<div className="inline-flex gap-3 items-center">
							<img src={lessons} className="w-4 h-4" />
							{course?.lectures || courseInProgress?.lectures} lessons
						</div>
						<div className="flex gap-3">
							<img src={topics} className="w-4 h-4" />
							{course?.lectures || courseInProgress?.lectures} courses
						</div>
					</div>
					<div className="flex gap-5 w-4/5 justify-start">
						<div className="flex gap-3">
							<img src={video} className="w-4 h-4" />
							Video content
						</div>
						<div className="flex gap-3">
							<img src={book} className="w-4 h-4" />
							Reading
						</div>
					</div>
					<div className="flex gap-3">
						<img src={quiz} className="w-4 h-4" />
						Quizzes
					</div>
					<div className="flex gap-3">
						<img src={certificateicon} className="w-4 h-4" />
						Certificate of completion
					</div>
				</div>
			</div>
		</div>
	);
};

const TutorModal = ({ course, showDeleteModal }) => {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const navigate = useNavigate();

	const handleEditCourse = () => {
		setIsEditModalOpen(true);
	};

	const handleCreateQuiz = () => {
		navigate(`/courses/${course.id}/quiz`);
	};

	return (
		<div className="fixed top-32 right-14 p-4 w-full max-w-[400px] max-h-[90vh] bg-white shadow-lg z-20 rounded-lg font-trap-grotesk">
			<div className="mb-4">
				<img
					src={course?.image}
					className="w-full h-[200px] object-cover rounded-md"
					alt="Course"
				/>
			</div>
			<div className="flex justify-between gap-3 mb-3">
				<p className="font-semibold text-2xl pt-2 text-primaryBlack font-trap-grotesk">
					{course?.price}
				</p>
				<button onClick={showDeleteModal}>
					<img src={deleteicon} alt="Delete" />
				</button>
			</div>
			<div className="flex flex-col gap-3">
				<PrimaryButton
					text={"Edit Course"}
					className="w-full"
					onClick={handleEditCourse}
				/>
				{course?.quiz.length === 0 && (
					<SecondaryButton
						text={"Create Quiz"}
						className="w-full"
						onClick={handleCreateQuiz}
					/>
				)}
			</div>
			<div className="text-primaryBlack pt-3">
				<h5 className="font-bold font-trap-grotesk text-lg">
					Course includes:
				</h5>
				<div className="flex flex-col gap-2 py-2 text-sm">
					<div className="flex gap-5 w-4/5 justify-start">
						<div className="inline-flex gap-3 items-center">
							<img
								src={lessons}
								className="w-4 h-4"
								alt="Lessons Icon"
							/>
							{course?.lectures} lessons
						</div>
						<div className="flex gap-3">
							<img src={topics} className="w-4 h-4" alt="Topics Icon" />
							{course?.lectures} courses
						</div>
					</div>
					<div className="flex gap-5 w-4/5 justify-start">
						<div className="flex gap-3">
							<img src={video} className="w-4 h-4" alt="Video Icon" />
							Video content
						</div>
						<div className="flex gap-3">
							<img src={book} className="w-4 h-4" alt="Book Icon" />
							Reading
						</div>
					</div>
					<div className="flex gap-3">
						<img src={quiz} className="w-4 h-4" alt="Quiz Icon" />
						Quizzes
					</div>
					<div className="flex gap-3">
						<img
							src={certificateicon}
							className="w-4 h-4"
							alt="Certificate Icon"
						/>
						Certificate of completion
					</div>
				</div>
			</div>
			{isEditModalOpen && (
				<EditCourse
					course={course}
					onCancel={() => setIsEditModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default CourseDetails;
