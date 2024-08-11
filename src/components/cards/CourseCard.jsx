import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ai from "/ai-course.svg";
import ProgressBar from "../../components/ProgressBar";
import ratings from "/icons/ratings.svg";
import { truncateString, formatPriceWithCommas } from "../../utils/utils";
import { userContext } from "../../context/UserContext";

export const ActiveCourseCard = ({ progress, course, id }) => {
	const navigate = useNavigate();
	const { user } = useContext(userContext);

	const handleClick = () => {
		if (user === null) {
			navigate("/student-signin");
		} else {
			navigate(`/courses/${course?.course.id}`);
		}
	};

	return (
		<div
			id={id}
			className="flex flex-col gap-2 border border-lighterGray p-3 rounded-lg font-trap-grotesk hover:border-hoverBlue hover:shadow-md"
			onClick={handleClick}
			style={{ minHeight: "380px" }}
		>
			<div className="w-full h-52 overflow-hidden rounded-lg">
				<img
					src={course?.course?.image}
					className="w-full h-full object-cover"
					alt="Course"
				/>
			</div>
			<h5 className="font-trap-grotesk font-bold leading-6 text-lg flex-grow">
				{truncateString(course?.course.title, 30)}
			</h5>
			<div className="flex flex-col">
				<p className="font-trap-grotesk text-lightGray text-sm">
					{course?.course?.instructorName}
				</p>
				<p className="text-lightGray items-center">
					<span className="font-trap-grotesk text-[10px]">
						{course?.course.totalNumberOfLessons} lecture •
					</span>
					<span className="font-trap-grotesk text-[10px]">
						{" "}
						{course?.course.difficulty}
					</span>
				</p>
			</div>
			<ProgressBar progress={progress} />
			<div className="flex justify-between text-lightGray ">
				<p className="font-trap-grotesk">{progress}% completed</p>
				<div>
					<img src={ratings} />
				</div>
			</div>
		</div>
	);
};

export const CourseCard = ({ course }) => {
	const navigate = useNavigate();
	const { user } = useContext(userContext);

	const handleClick = () => {
		if (user === null) {
			navigate("/student-signin");
		} else {
			navigate(`/courses/${course?.id}`);
		}
	};

	return (
		<div
			className="flex flex-col gap-2 border border-lighterGray p-3 rounded-lg font-trap-grotesk hover:border-hoverBlue hover:shadow-md cursor-pointer"
			onClick={handleClick}
			style={{ minHeight: "380px" }}
		>
			<div className="w-full h-52 overflow-hidden rounded-lg">
				<img
					src={course.image}
					className="w-full h-full object-cover"
					alt="Course"
				/>
			</div>
			<h5 className="font-trap-grotesk font-bold leading-6 text-lg flex-grow">
				{truncateString(course.title, 30)}
			</h5>
			<div className="flex flex-col flex-grow">
				<p className="font-trap-grotesk text-lightGray text-sm">
					{course.instructorName}
				</p>
				<p className="text-lightGray items-center">
					<span className="font-trap-grotesk text-[10px]">
						{course.totalNumberOfLessons} lectures •
					</span>
					<span className="font-trap-grotesk text-[10px]">
						{" "}
						{course.difficulty}
					</span>
				</p>
			</div>
			<div className="flex justify-between">
				<p className="font-trap-grotesk font-semibold">
					{course.currency}
					<span> {formatPriceWithCommas(course.price)} </span>
				</p>
				<div>
					<img src={ratings} alt="Ratings" />
				</div>
			</div>
		</div>
	);
};
