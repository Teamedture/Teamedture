import React, { useState, useEffect, useRef } from "react";
import imageupload from "/icons/image-upload.svg";

const formatNumber = (value) => {
	if (!value) return "";
	const parts = value.split(".");
	const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const decimalPart = parts[1] ? `.${parts[1]}` : "";
	return integerPart + decimalPart;
};

export const InputField = ({
	title,
	label,
	subtitle,
	type,
	name,
	value,
	onChange,
	placeholder,
	error,
}) => {
	const [inputValue, setInputValue] = useState(value || "");

	const handleChange = (e) => {
		const { value } = e.target;
		if (type === "number") {
			const cleanedValue = value.replace(/[^0-9.]/g, "");
			setInputValue(cleanedValue);
			onChange && onChange({ target: { name, value: cleanedValue } });
		} else {
			setInputValue(value);
			onChange && onChange({ target: { name, value } });
		}
	};

	const handleBlur = (e) => {
		if (type === "number") {
			const formattedValue = formatNumber(inputValue);
			setInputValue(formattedValue);
			onChange && onChange({ target: { name, value: formattedValue } });
		}
	};

	return (
		<div className="flex flex-col mb-4">
			{title && (
				<h3 className="text-xl font-semibold mb-2 text-primaryBlack">
					{title}
				</h3>
			)}
			{subtitle && (
				<p className="text-lg mb-2 text-primaryBlack font-medium">
					{subtitle}
				</p>
			)}
			{label && (
				<label className="pb-2 font-trap-grotesk font-medium text-lg">
					{label}
				</label>
			)}
			<input
				type={type === "number" ? "text" : type}
				name={name}
				value={inputValue}
				placeholder={placeholder}
				onChange={handleChange}
				onBlur={handleBlur}
				className={`border border-lightGray rounded-lg p-4 px-5 focus:border-primaryBlue focus:outline-none no-arrows ${
					error ? "border-red" : " border-lightGray"
				} `}
			/>
			{error && <p className="mt-2 text-sm text-red">{error}</p>}
		</div>
	);
};

// Text Area Input Field Component
export const TextAreaField = ({
	title,
	subtitle,
	label,
	value,
	onChange,
	error,
	...props
}) => {
	return (
		<div className="flex flex-col mb-4">
			{title && (
				<h3 className="text-xl font-semibold mb-2 text-primaryBlack">
					{title}
				</h3>
			)}
			{subtitle && (
				<p className="text-lg mb-2 text-primaryBlack font-medium">
					{subtitle}
				</p>
			)}
			{label && (
				<label className="pb-2 font-trap-grotesk font-medium text-lg">
					{label}
				</label>
			)}
			<textarea
				value={value}
				onChange={onChange}
				{...props}
				className={`border border-lightGray rounded-lg p-4 px-5 focus:border-primaryBlue focus:outline-none ${
					error ? "border-red" : " border-lightGray"
				}`}
			/>
			{error && <p className="mt-2 text-sm text-red">{error}</p>}
		</div>
	);
};

// Select Input Field Component
export const SelectField = ({
	title,
	label,
	options,
	value,
	onChange,
	placeholder,
	error,
	...props
}) => {
	return (
		<div className="flex flex-col mb-4">
			{title && (
				<h3 className="text-xl font-semibold mb-2 text-primaryBlack">
					{title}
				</h3>
			)}
			{label && (
				<label className="pb-2 font-trap-grotesk font-medium text-lg">
					{label}
				</label>
			)}
			<select
				value={value}
				onChange={onChange}
				{...props}
				className={`border border-lightGray rounded-lg p-4 px-5 focus:border-primaryBlue focus:outline-none ${
					!value ? "text-lightGray" : "text-primaryBlack"
				} ${error ? "border-red" : " border-lightGray"}`}
			>
				<option value="" disabled className="text-lightGray">
					{placeholder}
				</option>
				{options?.map((option, index) => (
					<option key={index} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{error && <p className="mt-2 text-sm text-red">{error}</p>}
		</div>
	);
};

// File Upload Component
export const FileUploadField = ({
	title,
	label,
	subtitle,
	note,
	fileData,
	handleFileChange,
	error,
	loading,
	...props
}) => {
	const [localFileData, setLocalFileData] = useState(fileData);

	useEffect(() => {
		setLocalFileData(fileData);
	}, [fileData]);

	const onFileChange = (e) => {
		const file = e.target.files.length > 0 ? e.target.files[0] : null;
		handleFileChange(file);
	};

	return (
		<div className="flex flex-col mb-4">
			{title && (
				<h3 className="text-xl font-semibold mb-2 text-primaryBlack">
					{title}
				</h3>
			)}
			{subtitle && (
				<p className="text-lg mb-2 text-primaryBlack font-medium">
					{subtitle}
				</p>
			)}
			{label && (
				<label className="pb-2 font-trap-grotesk font-medium text-lg">
					{label}
				</label>
			)}
			<div
				className={`relative h-72 w-[460px] border border-dashed border-lightGray rounded-lg overflow-hidden ${
					error ? "border-red" : " border-lightGray"
				}`}
			>
				<input
					type="file"
					{...props}
					onChange={onFileChange}
					className={`absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10 `}
				/>
				{localFileData?.fileUrl ? (
					<img
						src={localFileData.fileUrl}
						alt={localFileData.fileName}
						className="absolute inset-0 w-full h-full object-cover rounded-lg"
					/>
				) : (
					<div className="flex flex-col items-center justify-center h-full text-center text-primaryBlack p-4 bg-lighterGray">
						{loading ? (
							<p className="text-lightGray text-lg">
								Uploading...
							</p>
						) : (
							<div className="flex flex-col items-center justify-center gap-2">
								<img
									src={imageupload}
									className="rounded-full bg-white p-10"
								/>
								<span>Click to upload an image</span>
							</div>
						)}
					</div>
				)}
			</div>
			{note && <p className="mt-2 text-lightGray">{note}</p>}
			{localFileData?.fileName && (
				<p className="text-lg mt-2 text-primaryBlack">
					Uploaded file: {localFileData.fileName}
				</p>
			)}
			{error && <p className="mt-2 text-sm text-red">{error}</p>}
		</div>
	);
};

// export const TextEditor = ({ value, onChange, placeholder }) => {
// 	const editorRef = useRef(null);

// 	useEffect(() => {
// 		if (editorRef.current) {
// 			editorRef.current.innerHTML = value;
// 		}
// 	}, [value]);

// 	const handleCommand = (command) => {
// 		document.execCommand(command, false, null);
// 	};

// 	const handleInput = () => {
// 		if (editorRef.current) {
// 			onChange(editorRef.current.innerHTML);
// 		}
// 	};

// 	return (
// 		<div className="border rounded p-4">
// 			<div className="mb-2">
// 				<button
// 					type="button"
// 					onClick={() => handleCommand("bold")}
// 					className="mr-2 p-2 bg-gray-200 rounded hover:bg-gray-300"
// 				>
// 					<b>B</b>
// 				</button>
// 				<button
// 					type="button"
// 					onClick={() => handleCommand("italic")}
// 					className="p-2 bg-gray-200 rounded hover:bg-gray-300"
// 				>
// 					<i>I</i>
// 				</button>
// 			</div>
// 			<div
// 				ref={editorRef}
// 				contentEditable
// 				onInput={handleInput}
// 				className="min-h-[150px] border border-gray-300 rounded p-2 outline-none"
// 				placeholder={placeholder}
// 			></div>
// 		</div>
// 	);
// };

export const RadioTextGroup = ({ data, onDataChange }) => {
	const [selectedValue, setSelectedValue] = useState(data.correctAnswer || "");
	const [textValues, setTextValues] = useState(data.answers || {});

	useEffect(() => {
		onDataChange({ selectedValue, textValues });
	}, [selectedValue, textValues]);

	const handleRadioChange = (e) => {
		setSelectedValue(e.target.value);
	};

	const handleTextChange = (e) => {
		const optionValue = e.target.dataset.value;
		setTextValues((prevValues) => ({
			...prevValues,
			[optionValue]: e.target.value,
		}));
	};

	const radioOptions = [
		{ value: "option1", label: "Option 1" },
		{ value: "option2", label: "Option 2" },
		{ value: "option3", label: "Option 3" },
		{ value: "option4", label: "Option 4" },
	];

	return (
		<div className="flex flex-col">
			{radioOptions.map((option) => (
				<div key={option.value} className="flex items-center gap-2 mb-2">
					<input
						type="radio"
						name="quiz-radio"
						value={option.value}
						checked={selectedValue === option.value}
						onChange={handleRadioChange}
						className="h-5 w-5 text-primaryBlack border-lightGray rounded-full focus:ring-primaryBlue"
					/>
					<input
						type="text"
						data-value={option.value}
						value={textValues[option.value] || ""}
						onChange={handleTextChange}
						placeholder="Answer"
						className="border border-lightGray rounded-lg p-4 py-3 w-full"
					/>
				</div>
			))}
			<p className="text-lightGray pt-2">
				<span className="font-semibold">Note: </span>
				Use the radio button to select the correct answer.
			</p>
		</div>
	);
};

export const RadioTextTrueFalse = ({ data, onDataChange }) => {
	const [selectedValue, setSelectedValue] = useState(data.correctAnswer || "");
	const [textValues, setTextValues] = useState(data.answers || {});

	useEffect(() => {
		onDataChange({ selectedValue, textValues });
	}, [selectedValue, textValues]);

	const handleRadioChange = (e) => {
		setSelectedValue(e.target.value);
	};

	const handleTextChange = (e) => {
		const optionValue = e.target.dataset.value;
		setTextValues((prevValues) => ({
			...prevValues,
			[optionValue]: e.target.value,
		}));
	};

	const radioOptions = [
		{ value: "option1", label: "True" },
		{ value: "option2", label: "False" },
	];

	return (
		<div className="flex flex-col">
			{radioOptions.map((option) => (
				<div key={option.value} className="flex items-center gap-2 mb-2">
					<input
						type="radio"
						name="true-false-radio"
						value={option.value}
						checked={selectedValue === option.value}
						onChange={handleRadioChange}
						className="h-5 w-5 text-primaryBlack border-lightGray rounded-full focus:ring-primaryBlue"
					/>
					<input
						type="text"
						data-value={option.value}
						value={textValues[option.value] || ""}
						onChange={handleTextChange}
						placeholder="Answer"
						className="border border-lightGray rounded-lg p-4 py-3 w-full"
					/>
				</div>
			))}
			<p className="text-lightGray pt-2">
				<span className="font-semibold">Note: </span>
				Use the radio button to select the correct answer.
			</p>
		</div>
	);
};

// export const RadioTextGroup = ({ data, onDataChange }) => {
// 	const [selectedValue, setSelectedValue] = useState(data.selectedValue || "");
// 	const [textValues, setTextValues] = useState(data.textValues || {});

// 	useEffect(() => {
// 		onDataChange({ selectedValue, textValues });
// 	}, [selectedValue, textValues]);

// 	const handleRadioChange = (e) => {
// 		setSelectedValue(e.target.value);
// 	};

// 	const handleTextChange = (e) => {
// 		setTextValues((prevValues) => ({
// 			...prevValues,
// 			[e.target.dataset.value]: e.target.value,
// 		}));
// 	};

// 	const radioOptions = [
// 		{ value: "option1", label: "Option 1" },
// 		{ value: "option2", label: "Option 2" },
// 		{ value: "option3", label: "Option 3" },
// 		{ value: "option4", label: "Option 4" },
// 	];

// 	return (
// 		<div className="flex flex-col">
// 			{radioOptions.map((option) => (
// 				<div key={option.value} className="flex items-center gap-2 mb-2">
// 					<input
// 						type="radio"
// 						name="quiz-radio"
// 						value={option.value}
// 						checked={selectedValue === option.value}
// 						onChange={handleRadioChange}
// 						className="h-5 w-5 text-primaryBlack border-lightGray rounded-full focus:ring-primaryBlue"
// 					/>
// 					<input
// 						type="text"
// 						data-value={option.value}
// 						value={textValues[option.value] || ""}
// 						onChange={handleTextChange}
// 						placeholder="Answer"
// 						className="border border-lightGray rounded-lg p-4 py-3 w-full"
// 					/>
// 				</div>
// 			))}
// 			<p className="text-lightGray pt-2">
// 				<span className="font-semibold">Note: </span>
// 				Use the radio button to select the correct answer.
// 			</p>
// 		</div>
// 	);
// };

// export const RadioTextTrueFalse = ({ data, onDataChange }) => {
// 	const [selectedValue, setSelectedValue] = useState(data.selectedValue || "");
// 	const [textValues, setTextValues] = useState(data.textValues || {});

// 	useEffect(() => {
// 		onDataChange({ selectedValue, textValues });
// 	}, [selectedValue, textValues]);

// 	const handleRadioChange = (e) => {
// 		setSelectedValue(e.target.value);
// 	};

// 	const handleTextChange = (e) => {
// 		setTextValues((prevValues) => ({
// 			...prevValues,
// 			[e.target.dataset.value]: e.target.value,
// 		}));
// 	};

// 	const radioOptions = [
// 		{ value: "option1", label: "True" },
// 		{ value: "option2", label: "False" },
// 	];

// 	return (
// 		<div className="flex flex-col">
// 			{radioOptions.map((option) => (
// 				<div key={option.value} className="flex items-center gap-2 mb-2">
// 					<input
// 						type="radio"
// 						name="true-false-radio"
// 						value={option.value}
// 						checked={selectedValue === option.value}
// 						onChange={handleRadioChange}
// 						className="h-5 w-5 text-primaryBlack border-lightGray rounded-full focus:ring-primaryBlue"
// 					/>
// 					<input
// 						type="text"
// 						data-value={option.value}
// 						value={textValues[option.value] || ""}
// 						onChange={handleTextChange}
// 						placeholder="Answer"
// 						className="border border-lightGray rounded-lg p-4 py-3 w-full"
// 					/>
// 				</div>
// 			))}
// 			<p className="text-lightGray pt-2">
// 				<span className="font-semibold">Note: </span>
// 				Use the radio button to select the correct answer.
// 			</p>
// 		</div>
// 	);
// };
