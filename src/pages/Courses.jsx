import React, { useContext, useState, useEffect } from "react";
import {
	StudentDashboardLayout,
	TutorDashboardLayout,
} from "../layouts/DashboardLayout";
import RecommendedCourses from "../components/courses/RecommendedCourses";
import {
	ActiveStudentCourses,
	AllStudentCourses,
} from "../components/courses/StudentCourses";
import { userContext } from "../context/UserContext";
import AddCourseCard from "../components/cards/AddCourseCard";
import CreateCourse from "../components/courses/CreateCourse";
import { AllTutorCourses } from "../components/courses/TutorCourse";
import { useNavigate, Link } from "react-router-dom";
import arrowright from "/icons/arrow-right-active.svg";

const Courses = () => {
	const {
		tutorDashboardData,
		studentDashboardData,
		courses,
		user,
		studentCourses,
	} = useContext(userContext);
	const role = user?.role;

	const navigate = useNavigate();

	const [isCreatingCourse, setIsCreatingCourse] = useState(false);

	const tutorCourses = tutorDashboardData?.courses;
	const sortedTutorCourses = tutorCourses?.sort(
		(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
	);
	const showTutorAddCourse = tutorDashboardData?.courses?.length === 0;

	const allCourses = courses?.courses;

	const sortedStudentCourses = allCourses?.sort(
		(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
	);

	const sortedActiveStudentCourses = studentCourses?.sort(
		(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
	);

	const enrolledStudentCourses = studentDashboardData?.enrolledCourses?.slice(
		0,
		5
	);
	const notEnrolledCourses = sortedActiveStudentCourses?.slice(0, 4);
	const recommendedCourses = sortedStudentCourses?.slice(0, 4);

	const isNewStudent = studentDashboardData?.enrolledCourses?.length === 0;

	const handleAddCourseClick = () => {
		setIsCreatingCourse(true);
	};

	const handleCancel = () => {
		setIsCreatingCourse(false);
	};

	const handleViewCourse = () => {
		navigate("/allcourses");
		console.log("navigating to courses");
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const studentContent = (
		<>
			{isNewStudent ? (
				<>
					<AddCourseCard
						text={"Add Course"}
						heading={"My Courses"}
						onClick={handleViewCourse}
					/>
					<RecommendedCourses
						heading={"Recommended for you"}
						courses={recommendedCourses}
					/>
					<RecommendedCourses
						heading={"Top searches"}
						courses={recommendedCourses}
					/>
				</>
			) : (
				<div className="flex flex-col">
					<div className="flex items-center gap-1 border border-primaryBlue rounded-lg self-end p-3">
						<Link
							to="/allcourses"
							className=" font-trap-grotesk font-medium text-primaryBlue"
						>
							Explore Courses
						</Link>
						<img src={arrowright} />
					</div>

					<div className="flex">
						<ActiveStudentCourses
							heading={"Your Courses"}
							courses={enrolledStudentCourses}
						/>
					</div>
					<RecommendedCourses
						heading={"Recommended for you"}
						courses={notEnrolledCourses}
						slidesToShow={3}
					/>
					<AllStudentCourses
						itemsPerPage="9"
						courses={sortedActiveStudentCourses}
						gridCol={"grid-cols-3"}
					/>
				</div>
			)}
		</>
	);

	const tutorContent = (
		<>
			{isCreatingCourse ? (
				<CreateCourse onCancel={handleCancel} />
			) : (
				<>
					{showTutorAddCourse ? (
						<AddCourseCard
							text={"Create New Course"}
							heading={"My Courses"}
							onClick={handleAddCourseClick}
						/>
					) : (
						<div className="flex flex-col gap-10">
							<AddCourseCard
								text={"Create New Course"}
								heading={"My Courses"}
								onClick={handleAddCourseClick}
							/>
							<AllTutorCourses
								courses={tutorCourses}
								heading={"Your Courses"}
							/>
						</div>
					)}
				</>
			)}
		</>
	);

	const Layout =
		role === "STUDENT" ? StudentDashboardLayout : TutorDashboardLayout;

	return <Layout>{role === "STUDENT" ? studentContent : tutorContent}</Layout>;
};

export default Courses;
