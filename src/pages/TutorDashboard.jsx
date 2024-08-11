import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/UserContext";
import DashboardBanner from "../components/dashboard/DashboardBanner";
import { TutorDashboardLayout } from "../layouts/DashboardLayout";
import CourseStatusCard from "../components/cards/CourseStatusCard";
import enrolled from "/icons/enrolled-course.svg";
import active from "/icons/active-course.svg";
import { SpinnerLoader } from "../components/Loader";
import AddCourseCard from "../components/cards/AddCourseCard";
import CreateCourse from "../components/courses/CreateCourse";
import {
	AllTutorCourses,
	RecentTutorCourses,
	TutorCourses,
} from "../components/courses/TutorCourse";

const TutorDashboard = () => {
	const {
		tutorDashboardData,
		tutorLoading,
		tutorError,
		userLoading,
		userError,
		token,
		user,
	} = useContext(userContext);

	const [isCreatingCourse, setIsCreatingCourse] = useState(false);

	const handleAddCourseClick = () => {
		setIsCreatingCourse(true);
	};

	const handleCancel = () => {
		setIsCreatingCourse(false);
	};

	if (userError || tutorError) {
		return <div>Error: {userError || tutorError}</div>;
	}

	const tutorCourses = tutorDashboardData?.courses;
	const sortedTutorCourses = tutorCourses?.sort(
		(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
	);

	const recentTutorCourses = sortedTutorCourses?.slice(0, 2);

	const dashboardTutorCourses = sortedTutorCourses?.slice(0, 12);

	const isNewUser = tutorDashboardData?.courses?.length === 0;
	const activeCoursesCount =
		tutorDashboardData?.totalActiveCourses?.length || 0;
	const showAddCourse = tutorDashboardData?.courses?.length === 0;
	const role = "TUTOR";

	return (
		<>
			{(userLoading || tutorLoading) && <SpinnerLoader />}
			<TutorDashboardLayout>
				<>
					{isCreatingCourse ? (
						<CreateCourse onCancel={handleCancel} />
					) : (
						<>
							<DashboardBanner
								className="pt-6"
								isNewUser={isNewUser}
								role={role}
							/>
							<div className="grid grid-cols-2 gap-6">
								<CourseStatusCard
									number={tutorDashboardData?.totalCourses || 0}
									status={"Total"}
									icon={enrolled}
								/>
								<CourseStatusCard
									number={tutorDashboardData?.totalActiveCourses || 0}
									status={"Active"}
									icon={active}
								/>
							</div>
							{showAddCourse ? (
								<AddCourseCard
									text={"Create New Course"}
									heading={"My Courses"}
									onClick={handleAddCourseClick}
								/>
							) : (
								<div className="flex flex-col gap-10">
									<div className="gap-3 items-center justify-between">
										<RecentTutorCourses
											heading={"Your Recent Courses"}
											courses={recentTutorCourses}
											onClick={handleAddCourseClick}
										/>
									</div>
									<AllTutorCourses
										courses={dashboardTutorCourses}
										heading={"Your Courses"}
									/>
								</div>
							)}
						</>
					)}
				</>
			</TutorDashboardLayout>
		</>
	);
};

export default TutorDashboard;
