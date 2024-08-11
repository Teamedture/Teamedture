import React from "react";
import CourseDetailsLayout from "../layouts/CourseDetailsLayout";
import QuizCreation from "../components/courses/QuizCreation";
import { TutorDashboardLayout } from "../layouts/DashboardLayout";

const Quiz = () => {
	return (
		<div>
			<TutorDashboardLayout>
				<QuizCreation></QuizCreation>
			</TutorDashboardLayout>
		</div>
	);
};

export default Quiz;
