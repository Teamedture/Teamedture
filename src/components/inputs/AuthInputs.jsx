import React, { useState } from "react";
import { useField } from "formik";
import viewPassword from "/view-password.svg";
import closePassword from "/close-password.svg";

const InputField = ({ label, type, disabled, ...props }) => {
	const [field, meta, helpers] = useField(props);
	const [showPassword, setShowPassword] = useState(false);
	const errorText = meta.touched && meta.error ? meta.error : "";

	const togglePasswordVisibility = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};

	const handleFocus = () => {
		if (props.name === "password") {
			props.onFocus && props.onFocus();
		}
	};

	return (
		<div className="flex flex-col w-full gap-2">
			<label htmlFor={props.name} className="font-medium text-darkGray">
				{label} <span className="text-lightGray">*</span>
			</label>
			<div className="relative">
				<input
					disabled={disabled}
					{...field}
					{...props}
					type={showPassword ? "text" : type}
					onFocus={handleFocus}
					className={`py-2 px-3 lg:py-3 border ${
						errorText ? "border-red" : "border-lightGray"
					}  ${
						disabled
							? "bg-lighterGray text-darkGray cursor-not-allowed"
							: "bg-white"
					} rounded-lg placeholder:text-[#c5c3c3a8] focus:border-primaryBlue w-full`}
				/>
				{props.name === "password" && (
					<button
						type="button"
						className="absolute inset-y-0 right-0 pr-3 flex items-center"
						onClick={togglePasswordVisibility}
					>
						<img
							src={showPassword ? viewPassword : closePassword}
							className="w-5"
						/>
					</button>
				)}
			</div>
			{errorText && <div className="text-red text-sm">{errorText}</div>}
		</div>
	);
};

export default InputField;
