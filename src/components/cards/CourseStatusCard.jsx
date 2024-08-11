import React from "react";

const CourseStatusCard = ({ icon, number, status }) => {
	return (
		<div className="flex flex-col gap-6 border justify-center items-center text-center border-lighterGray p-x-6 py-10 rounded-lg w-full font-trap-grotesk">
			<div className="">
				<img src={icon} />
			</div>
			<div>
				<p className="font-trap-grotesk text-3xl font-semibold">{number}</p>
				<p className="font-trap-grotesk text-xl">{status} Courses</p>
			</div>
		</div>
	);
};

export default CourseStatusCard;
