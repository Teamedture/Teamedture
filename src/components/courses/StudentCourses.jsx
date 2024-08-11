import React, { useState } from "react";
import { CourseCard } from "../cards/CourseCard";
import CourseCarousel from "../carousel/CourseCarousel";
import AddCourseCard from "../cards/AddCourseCard";
import { ActiveCourseCard } from "../cards/CourseCard";
import Pagination from "./Pagination";

export const ActiveStudentCourses = ({ heading, courses }) => {
	return (
		<section className="flex flex-col gap-4">
			<div>
				<h3 className="text-2xl font-medium">{heading}</h3>
			</div>
			<div className="flex gap-3">
				{courses?.length > 3 ? (
					<CourseCarousel>
						{courses?.map((course, index) => (
							<ActiveCourseCard
								progress={course.progress}
								course={course}
								key={index}
							/>
						))}
					</CourseCarousel>
				) : (
					<div className="grid grid-cols-3 gap-5">
						{courses?.map((course, index) => (
							<ActiveCourseCard
								progress={course.progress}
								course={course}
								key={index}
							/>
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export const RecentStudentCourses = ({ heading, onClick, courses }) => {
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

export const AllStudentCourses = ({
	heading,
	courses,
	itemsPerPage,
	gridCol,
}) => {
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(courses?.length / itemsPerPage);
	const indexOfLastCourse = currentPage * itemsPerPage;
	const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
	const currentCourses = courses?.slice(indexOfFirstCourse, indexOfLastCourse);

	return (
		<div className="flex flex-col gap-4">
			<h3 className="font-medium text-2xl">{heading}</h3>
			<div className={`grid gap-3 ${gridCol}`}>
				{currentCourses?.map((course) => (
					<CourseCard key={course?.id} course={course} />
				))}
			</div>
			<Pagination
				totalPages={totalPages}
				currentPage={currentPage}
				onClick={(page) => setCurrentPage(page)}
			/>
		</div>
	);
};
