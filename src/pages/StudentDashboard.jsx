import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardBanner from "../components/dashboard/DashboardBanner";
import { StudentDashboardLayout } from "../layouts/DashboardLayout";
import { userContext } from "../context/UserContext";
import CourseStatusCard from "../components/cards/CourseStatusCard";
import enrolled from "/icons/enrolled-course.svg";
import active from "/icons/active-course.svg";
import completed from "/icons/completed-course.svg";
import { ActiveStudentCourses } from "../components/courses/StudentCourses";
import RecommendedCourses from "../components/courses/RecommendedCourses";
import { SpinnerLoader } from "../components/Loader";
import axios from "axios";

const StudentDashboard = () => {
	const {
		studentDashboardData,
		studentLoading,
		studentError,
		userLoading,
		userError,
		token,
		user,
		courses,
		studentCourses,
		setCourses,
	} = useContext(userContext);

	const navigate = useNavigate();

	const allCourses = courses?.courses;

	const sortedStudentCourses = allCourses?.sort(
		(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
	);

	const recommendedCourses = sortedStudentCourses?.slice(0, 4);

	const enrolledStudentCourses = studentDashboardData?.enrolledCourses?.slice(
		0,
		5
	);

	const isNewUser = studentDashboardData?.enrolledCourses?.length === 0;
	const activeCoursesCount =
		studentDashboardData?.totalActiveCourses?.length || 0;
	const role = "STUDENT";

	return (
		<>
			{(userLoading || studentLoading) && <SpinnerLoader />}
			<StudentDashboardLayout>
				<>
					<DashboardBanner
						className="pt-6"
						isNewUser={isNewUser}
						role={role}
					/>
					<div className="grid grid-cols-3 gap-6">
						<CourseStatusCard
							number={studentDashboardData?.totalEnrolledCourses || 0}
							status={"Enrolled"}
							icon={enrolled}
						/>
						<CourseStatusCard
							number={studentDashboardData?.totalActiveCourses || 0}
							status={"Active"}
							icon={active}
						/>
						<CourseStatusCard
							number={studentDashboardData?.totalCompletedCourses || 0}
							status={"Completed"}
							icon={completed}
						/>
					</div>
					{isNewUser ? (
						<RecommendedCourses
							heading={"Recommended"}
							courses={recommendedCourses}
						/>
					) : (
						<>
							<div className="">
								<ActiveStudentCourses
									heading={"Your Courses"}
									courses={enrolledStudentCourses}
								/>
							</div>
							<RecommendedCourses
								heading={"Recommended"}
								courses={studentCourses}
							/>
						</>
					)}
				</>
			</StudentDashboardLayout>
		</>
	);
};

export default StudentDashboard;
