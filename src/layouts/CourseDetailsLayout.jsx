import React from "react";
import CourseHeader from "../components/courses/CourseHeader";
import CourseFooter from "../components/courses/CourseFooter";

const CourseDetailsLayout = ({ children, showFooter = true }) => {
	return (
			
			<div className="flex flex-col w-full min-h-screen">
				<CourseHeader />
				<div className="flex flex-col gap-8 flex-grow">{children}</div>
				{showFooter && <CourseFooter />}
			</div>
	);
};

export default CourseDetailsLayout;
