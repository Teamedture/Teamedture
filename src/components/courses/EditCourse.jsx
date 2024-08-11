import React, { useState, useContext, useEffect } from "react";
import {
	InputField,
	SelectField,
	FileUploadField,
	TextAreaField,
} from "../inputs/CourseCreationInputs";
import { PrimaryButton, SecondaryButton } from "../Button";
import { userContext } from "../../context/UserContext";
import LessonContainer from "./LessonsContainer";
import { SuccessModal, ConfirmationModal } from "../popups/Modal";
import successgif from "/success-gif.gif";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { SpinnerLoader } from "../Loader";
import { useNavigate, useParams } from "react-router-dom";

const animatedComponents = makeAnimated();
const capitalize = (string) =>
	string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

const EditCourse = ({ course, onCancel }) => {
	const navigate = useNavigate();
	const { courseId } = useParams();

	const {
		loading,
		setLoading,
		error: courseError,
		setError,
		firstName,
		lastName,
	} = useContext(userContext);

	const tutorsName = `${capitalize(firstName)} ${capitalize(lastName)}`;

	const options = [
		{ value: "programming", label: "Programming" },
		{ value: "ai", label: "AI" },
		{ value: "machine learning", label: "Machine Learning" },
		{ value: "others", label: "Others" },
	];

	const [step, setStep] = useState(1);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [lessons, setLessons] = useState([]);
	const [formData, setFormData] = useState({
		courseTitle: "",
		courseDescription: "",
		category: "",
		tags: [],
		courseImage: {
			file: null,
			fileName: "",
			fileUrl: "",
		},
		difficultyLevel: "",
		currency: "NGN",
		price: "",
		instructorsName: tutorsName,
		instructorsBio: "",
	});

	useEffect(() => {
		if (course) {
			setFormData({
				courseTitle: course.title || "",
				courseDescription: course.description || "",
				category: course.category || "",
				tags: course.tags.map((tag) => ({ value: tag, label: tag })) || [],
				courseImage: {
					file: null,
					fileName: "",
					fileUrl: course.image || "",
				},
				difficultyLevel: course.difficulty || "",
				currency: course.currency || "NGN",
				price: course.price ? course.price.toString() : "",
				instructorsName: course.instructorName || "",
				instructorsBio: course.instructorBio || "",
			});

			setLessons(
				course.lessons.map((lesson, index) => ({
					id: index,
					lessonTitle: lesson.title,
					items: lesson.topics.map((topic) => ({
						topicTitle: topic.title,
						content: {
							type: topic.contentType,
							text: topic.textDescription || "",
							url: topic.videoUrl || "",
							duration: topic.videoDurationInSeconds || 0,
						},
						description: topic.description || "",
						resources: topic.downloadableMaterials.map((material) => ({
							name: material.name,
							url: material.url,
						})),
						links: topic.links || [],
					})),
				}))
			);
		}
	}, [course]);

	const handleCreationUpdate = () => setShowSuccessModal(true);
	const handleCloseModal = () => setShowConfirmModal(false);
	const handleNextStep = () => setStep(step + 1);
	const handlePreviousStep = () => setStep(step - 1);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleFileChange = async (file) => {
		if (file) {
			const formData = new FormData();
			formData.append("file", file);

			try {
				const response = await axios.post(
					"https://edture.onrender.com/cloudinary/upload",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);

				const data = response.data;
				const fileUrl = data.url;

				setFormData((prevData) => ({
					...prevData,
					courseImage: {
						file: file,
						fileName: file.name,
						fileUrl: fileUrl,
					},
				}));
			} catch (error) {
				console.error("Error uploading file:", error);
			}
		}
	};

	const handleSelectChange = (selectedOptions) => {
		setFormData((prevData) => ({
			...prevData,
			tags: selectedOptions,
		}));
	};

	const validate = () => {
		const newErrors = {};

		if (step === 1) {
			// Step 1 validation
			if (!formData.courseTitle)
				newErrors.courseTitle = "Course title is required";
			if (!formData.courseDescription)
				newErrors.courseDescription = "Course description is required";
			if (!formData.category) newErrors.category = "Category is required";
			if (formData.tags.length === 0)
				newErrors.tags = "At least one tag is required";
		} else if (step === 2) {
			if (!formData.courseImage.file && !formData.courseImage.fileUrl)
				newErrors.courseImage = "Course image is required";
			if (!formData.difficultyLevel)
				newErrors.difficultyLevel = "Difficulty level is required";
			if (!formData.currency) newErrors.currency = "Currency is required";
			if (!formData.price || formData.price <= 0)
				newErrors.price = "Price must be a positive number";
			if (!formData.instructorsName)
				newErrors.instructorsName = "Instructor name is required";
			if (!formData.instructorsBio)
				newErrors.instructorsBio = "Instructor bio is required";
		}

		setError(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleCancel = () => {
		setFormData({
			courseTitle: "",
			courseDescription: "",
			category: "",
			tags: [],
			courseImage: { file: null, fileName: "", fileUrl: "" },
			difficultyLevel: "",
			currency: "",
			price: "",
			instructorsName: "",
			instructorsBio: "",
		});
		setError({});
		setStep(1);
		onCancel();
	};

	const navigateToCourses = () => {
		navigate("/courses");
		window.location.reload();
	};

	const handleUpdateCourse = () => {
		if (!validate()) return;
		setShowConfirmModal(true);
	};

	const confirmUpdateCourse = async () => {
		const cleanedPrice = formData.price.replace(/,/g, "");
		const price = parseFloat(cleanedPrice);

		if (!validate()) return;

		const courseData = {
			title: formData.courseTitle,
			description: formData.courseDescription,
			category: formData.category,
			tags: formData.tags.map((tag) => tag.value),
			image: formData.courseImage.fileUrl,
			difficulty: formData.difficultyLevel,
			status: "Active",
			price: price,
			currency: formData.currency,
			instructorName: formData.instructorsName,
			instructorBio: formData.instructorsBio,
		};

		setLoading(true);
		try {
			const response = await axios.put(
				`https://edture.onrender.com/courses/${course.id}`,
				courseData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);
			console.log("Course updated successfully:", response.data);
			setLoading(false);
			handleCreationUpdate();
		} catch (err) {
			setLoading(false);
			console.error("Error updating course:", err.message);
		}
	};

	const handleUpdateLessons = async () => {
		const lessonData = {
			lessons: lessons.map((lesson) => ({
				title: lesson.lessonTitle,
				curriculum: lesson.items.map((item) => item.topicTitle),
				topics: lesson.items.map((item) => ({
					title: item.topicTitle,
					contentType: item?.content?.type,
					textDescription:
						item.content.type === "text" ? item.content.text : "",
					videoUrl: item.content.type === "video" ? item.content.url : "",
					videoDurationInSeconds:
						item.content.type === "video" ? item.content.duration : 0,
					description: item.description || "",
					downloadableMaterials: item.resources.map((resource) => ({
						type: "pdf",
						name: resource.name,
						url: resource.url,
					})),
					links: item.links || [],
				})),
			})),
		};

		setLoading(true);
		try {
			await axios.put(
				`https://edture.onrender.com/courses/${course.id}/lessons`,
				lessonData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				}
			);
			console.log("Lessons updated successfully");
			setLoading(false);
			handleCreationUpdate();
		} catch (error) {
			setLoading(false);
			console.error("Error updating lessons:", error.message);
		}
	};

	return (
		<>
			{loading && <SpinnerLoader />}
			{!showSuccessModal && !showConfirmModal && (
				<div className="fixed inset-0 z-30 flex items-center justify-center bg-primaryBlack bg-opacity-50 text-primaryBlack">
					<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[800px]">
						<h1 className="text-2xl font-bold mb-4 text-primaryBlack">
							Edit Course
						</h1>
						{step === 1 && (
							<div>
								<InputField
									label="Course Title"
									name="courseTitle"
									value={formData.courseTitle}
									onChange={handleChange}
									error={courseError?.courseTitle}
								/>
								<TextAreaField
									label="Course Description"
									name="courseDescription"
									value={formData.courseDescription}
									onChange={handleChange}
									error={courseError?.courseDescription}
									rows="8"
								/>
								<SelectField
									label="Category"
									name="category"
									value={formData.category}
									onChange={handleChange}
									options={options}
									error={courseError?.category}
								/>
								<Select
									closeMenuOnSelect={false}
									components={animatedComponents}
									isMulti
									name="tags"
									options={options}
									value={formData.tags}
									onChange={handleSelectChange}
									placeholder="Select tags"
								/>
								<div className="text-red">{courseError?.tags}</div>
								<div className="flex justify-between mt-8">
									<SecondaryButton
										onClick={handleCancel}
										text={"Cancel"}
									/>
									<PrimaryButton
										onClick={handleNextStep}
										text={"Next"}
									/>
								</div>
							</div>
						)}

						{step === 2 && (
							<div>
								<FileUploadField
									label="Course Image"
									fileData={formData.courseImage}
									handleFileChange={handleFileChange}
									error={courseError?.courseImage}
								/>
								<SelectField
									title="Difficulty Level"
									options={[
										{ value: "Beginner", label: "Beginner" },
										{ value: "Intermediate", label: "Intermediate" },
										{ value: "Advanced", label: "Advanced" },
									]}
									name="difficultyLevel"
									value={formData.difficultyLevel}
									onChange={handleChange}
									error={courseError.difficultyLevel}
								/>
								<div>
									<h3 className="text-xl font-semibold mb-2 text-primaryBlack">
										Pricing
									</h3>
									<div className="flex justify-start items-center gap-2">
										<SelectField
											options={[{ value: "NGN", label: "NGN" }]}
											name="currency"
											value={formData.currency}
											onChange={handleChange}
											error={courseError.currency}
										/>
										<InputField
											type="number"
											name="price"
											value={formData.price}
											onChange={handleChange}
											error={courseError.price}
										/>
									</div>
								</div>
								<InputField
									label="Instructor's Name"
									name="instructorsName"
									value={formData.instructorsName}
									onChange={handleChange}
									error={courseError?.instructorsName}
								/>
								<TextAreaField
									label="Instructor's Bio"
									name="instructorsBio"
									value={formData.instructorsBio}
									onChange={handleChange}
									error={courseError?.instructorsBio}
								/>

								<div className="flex justify-between mt-8">
									<SecondaryButton
										onClick={handlePreviousStep}
										text={"Previous"}
									/>
									<PrimaryButton
										onClick={handleUpdateCourse}
										text={"Update Course"}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
			{showConfirmModal && (
				<ConfirmationModal
					onClose={handleCloseModal}
					onConfirm={confirmUpdateCourse}
					heading="Confirm Update"
					content="Are you sure you want to update the contents of this course?"
					confirmText={"Yes"}
					cancelText={"No"}
				/>
			)}

			{showSuccessModal && (
				<SuccessModal
					content="Course updated successfully!"
					onConfirm={navigateToCourses}
					buttonText={"Back to Courses"}
					img={successgif}
					allowClose={false}
				/>
			)}
		</>
	);
};

export default EditCourse;
