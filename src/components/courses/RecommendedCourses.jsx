import React from "react";
import { CourseCard } from "../cards/CourseCard";
import CourseCarousel from "../carousel/CourseCarousel";

const RecommendedCourses = ({ heading, className , courses, styleClass, slidesToShow, autoPlay, flowDirection}) => {
	return (
		<div className={`flex flex-col gap-4 ${styleClass}`}>
			<h3 className="font-medium text-2xl">{heading}</h3>
			<CourseCarousel className={className} slidesToShow={slidesToShow} autoplay={autoPlay} flowDirection={flowDirection}>
				{courses?.map((course) => (
					<CourseCard key={course.id} course={course} />
				))}
			</CourseCarousel>
		</div>
	);
};

export default RecommendedCourses;
