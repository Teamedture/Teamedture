import React, { useState } from "react";
import Lesson from "./Lesson";
import { PrimaryButton, SecondaryButton } from "../Button";
import { InputField } from "../inputs/CourseCreationInputs";
import addicon from "/icons/add-course.svg";

const LessonContainer = ({
	lessons,
	addLesson,
	updateLesson,
	deleteLesson,
}) => {
	return (
		<div className="">
			<div className="flex flex-col gap-5">
				{lessons.map((lesson, index) => (
					<Lesson
						key={lesson.id}
						lesson={lesson}
						updateLesson={updateLesson}
						deleteLesson={deleteLesson}
						lessonCount={index + 1}
					/>
				))}
			</div>
			<AddLessonButton addLesson={addLesson} lessonCount={lessons.length} />
		</div>
	);
};

const AddLessonButton = ({ addLesson, lessonCount }) => {
	const [showInput, setShowInput] = useState(false);
	const [lessonTitle, setLessonTitle] = useState("");

	const handleAdd = () => {
		if (lessonTitle) {
			addLesson(lessonTitle);
			setLessonTitle("");
			setShowInput(false);
		}
	};

	const handleChange = (e) => {
		setLessonTitle(e.target.value);
	};

	return (
		<div>
			{showInput && (
				<div className="flex flex-col gap-3 mt-4 border border-lightGray rounded-lg p-4">
					<div>
						<h4 className="font-medium text-lg">
							Lesson {lessonCount + 1}:
						</h4>
					</div>
					<InputField
						name="lessonTitle"
						label="Lesson title"
						type="text"
						placeholder="Enter a title"
						value={lessonTitle}
						onChange={handleChange}
					/>
					<div className="flex gap-2">
						<PrimaryButton onClick={handleAdd} text={"Add Lesson"} />
						<SecondaryButton
							onClick={() => setShowInput(false)}
							text={"Cancel"}
						/>
					</div>
				</div>
			)}
			<SecondaryButton
				onClick={() => setShowInput(true)}
				text={"Lesson"}
				icon={addicon}
				className="mt-4 flex gap-2"
			/>
		</div>
	);
};

export default LessonContainer;
