import React, { useContext, useEffect } from "react";
import RecommendedCourses from "../components/courses/RecommendedCourses";
import { userContext } from "../context/UserContext";
import { AllStudentCourses } from "../components/courses/StudentCourses";
import Navbar from "../components/courses/Navbar";
import CourseFooter from "../components/courses/CourseFooter";

const OurCourses = () => {
	const { courses } = useContext(userContext);
	const allCourses = courses?.courses;

	const sortedStudentCourses = allCourses?.sort(
		(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
	);
	const recommendedCourses = sortedStudentCourses?.slice(0, 4);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div>
			<Navbar />
			<div className="px-12 py-10 flex flex-col gap-8">
				<div
					className="bg-darkBlue p-16 rounded-lg"
					style={{ backgroundImage: "url('/course-banner.svg')" }}
				>
					<h2 className="font-trap-grotesk text-5xl font-semibold text-white text-center">
						Courses
					</h2>
				</div>
				<RecommendedCourses
					heading={"Recommended for you"}
					courses={recommendedCourses}
					slidesToShow={3.5}
				/>
				<AllStudentCourses
					courses={allCourses}
					heading={"All courses"}
					itemsPerPage={12}
					gridCol={"grid-cols-4"}
				/>
			</div>
			<CourseFooter />
		</div>
	);
};

export default OurCourses;
