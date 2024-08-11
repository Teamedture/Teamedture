import React from "react";
import { CourseCard } from "../cards/CourseCard";
import CourseCarousel from "../carousel/CourseCarousel";
import AddCourseCard from "../cards/AddCourseCard";

export const TutorCourses = ({ heading, className, courses }) => {
	return (
		<div className="flex flex-col gap-4">
			<h3 className="font-medium text-2xl">{heading}</h3>
			<CourseCarousel className={className}>
				{courses?.map((course) => (
					<CourseCard key={course?.id} course={course} />
				))}
			</CourseCarousel>
		</div>
	);
};

export const RecentTutorCourses = ({ heading, onClick, courses }) => {
	return (
		<div className="flex flex-col gap-4">
			<h3 className="font-medium text-2xl">{heading}</h3>
			<div className="flex gap-4 items-center justify-between">
				<div className="grid grid-cols-2 gap-3 flex-grow">
					{courses?.map((course) => (
						<CourseCard key={course?.id} course={course} />
					))}
				</div>
				<AddCourseCard onClick={onClick} text={"Create New Course"} />
			</div>
		</div>
	);
};

export const AllTutorCourses = ({ heading, className, courses }) => {
	return (
		<div className="flex flex-col gap-4">
			<h3 className="font-medium text-2xl">{heading}</h3>
			<div className="grid grid-cols-3 gap-3">
				{courses?.map((course) => (
					<CourseCard key={course?.id} course={course} />
				))}
			</div>
		</div>
	);
};
