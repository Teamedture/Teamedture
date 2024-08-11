import React, { useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
	PrimaryButton,
	SecondaryButton,
	IconButton,
} from "../components/Button";
import AuthCarousel from "../components/carousel/AuthCarousel";
import InputField from "../components/inputs/AuthInputs";
import google from "/google.png";
import logo from "/edture-logo.svg";
import { DividerWithText, Divider } from "../components/Dividers";
import { Link, useNavigate } from "react-router-dom";
import ValidationIndicator from "../components/inputs/ValidationIndicator";
import { userContext } from "../context/UserContext";
import { TutorGoogleSignUp } from "../components/authentication/GoogleAuth";

const TutorSignup = () => {
	const navigate = useNavigate();
	const { authError, setAuthError, authLoading, setAuthLoading } =
		useContext(userContext);

	const tutorImages = [
		"/signup-carousel/tutor1.png",
		"/signup-carousel/tutor2.png",
		"/signup-carousel/tutor3.png",
		"/signup-carousel/tutor4.png",
	];

	const [step, setStep] = useState(1);

	const [passwordTouched, setPasswordTouched] = useState(false);
	const [passwordFocused, setPasswordFocused] = useState(false);
	const [passwordValidations, setPasswordValidations] = useState({
		length: false,
		upperLower: false,
		numberSpecialChar: false,
	});

	const validatePassword = (password) => {
		setPasswordValidations({
			length: password.length >= 8 && password.length <= 72,
			upperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
			numberSpecialChar: /[0-9\W_]/.test(password),
		});
	};

	const initialValues = {
		email: "",
		password: "",
		firstname: "",
		lastname: "",
		username: "",
		receiveNewsletterUpdate: false,
	};

	const validationSchemaStep1 = Yup.object({
		email: Yup.string()
			.email("Invalid email address")
			.required("Email is required"),
		password: Yup.string().required("Password is required"),
	});

	const validationSchemaStep2 = Yup.object({
		firstname: Yup.string().required("First name is required"),
		lastname: Yup.string().required("Last name is required"),
		username: Yup.string().required("Username is required"),
	});

	const onSubmit = async (values) => {
		try {
			setAuthLoading(true);

			const role = "TUTOR";
			const data = {
				...values,
				role: role,
			};

			const response = await fetch("https://edture.onrender.com/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				const messages = result.message;
				let errorMessage = "";

				if (typeof messages === "string") {
					errorMessage = messages;
				} else if (typeof messages === "object") {
					const usernameError =
						messages.username ===
						"A user with this username already exists";
					const emailError =
						messages.email === "A user with this email already exists";

					if (usernameError && emailError) {
						errorMessage =
							"A user with this email and username already exists.";
					} else if (usernameError) {
						errorMessage = messages.username;
					} else if (emailError) {
						errorMessage = messages.email;
					} else {
						errorMessage = "An unexpected error occurred.";
					}
				}

				setAuthError(errorMessage);
				setAuthLoading(false);
				return;
			}

			setAuthLoading(false);
			setAuthError(null);
			navigate("/tutor-signin");
		} catch (error) {
			setAuthLoading(false);
			setAuthError(error.message || "An unexpected error occurred.");
			console.error("Error submitting data:", error.message);
		}
	};

	const nextStep = (formikProps) => {
		if (step === 1) {
			formikProps.validateForm().then((errors) => {
				if (Object.keys(errors).length === 0) {
					setStep(step + 1);
				}
			});
		} else {
			setStep(step + 1);
		}
	};

	const prevStep = () => setStep(step - 1);
	const goToStep = (stepNumber) => setStep(stepNumber);

	return (
		<section className="flex flex-col lg:flex-row items-center p-5 lg:pr-[120px] lg:pl-8 lg:py-6">
			<div className="hidden md:block fixed left-0 top-0 bottom-0 w-[45%] bg-white z-0">
				<AuthCarousel images={tutorImages} className="" />
			</div>
			<div className="flex flex-row justify-center items-center lg:w-1/2 w-full lg:ml-auto">
				<Formik
					initialValues={initialValues}
					validationSchema={
						step === 1 ? validationSchemaStep1 : validationSchemaStep2
					}
					onSubmit={onSubmit}
					validateOnChange={true}
					validateOnBlur={true}
				>
					{(formikProps) => (
						<Form className="w-full py-8 lg:py-5 flex flex-col gap-4 lg:gap-8 justify-between">
							<div className="w-[20%] md:w-[15%] self-end pb-8">
								<img src={logo} className="w-full" alt="Logo" />
							</div>
							<div>
								<div className="flex flex-row gap-2 justify-between items-center">
									<h3 className="text-3xl font-semibold w-1/2">
										Create an Account
									</h3>
									{step !== 2 && (
										<Link
											to="/student-signup"
											className="rounded-lg text-base bg-transparent border border-bg-primaryBlue text-primaryBlue p-2 md:py-3 md:px-5 hover:bg-secondaryHoverBlue cursor-pointer transition-all ease-in font-trap-grotesk font-medium tracking-tight"
										>
											Switch to Student
										</Link>
									)}
								</div>
								<div className="flex mt-3 mb-6 md:mb-0">
									<div className="flex w-[20%] justify-between gap-1">
										<div
											onClick={() => goToStep(1)}
											className={`h-1 rounded-full cursor-pointer transition-all duration-300 ${
												step === 1
													? "bg-darkGray w-[70%]"
													: "bg-lightGray w-[30%]"
											}`}
										></div>
										<div
											onClick={() => goToStep(2)}
											className={`h-1 rounded-full cursor-pointer transition-all duration-300 ${
												step === 2
													? "bg-darkGray w-[70%]"
													: "bg-lightGray w-[30%]"
											}`}
										></div>
									</div>
								</div>
							</div>
							{step === 1 && (
								<div className="flex flex-col gap-6">
									<TutorGoogleSignUp />
									<DividerWithText />
									<InputField
										label="Email Address"
										name="email"
										placeholder="Enter your email address"
									/>
									<InputField
										label="Password"
										name="password"
										type="password"
										placeholder="********"
										onFocus={() => setPasswordFocused(true)}
										onBlur={(e) => {
											formikProps.handleBlur(e);
											setPasswordFocused(false);
											setPasswordTouched(true);
											validatePassword(e.target.value);
										}}
										onChange={(e) => {
											formikProps.handleChange(e);
											validatePassword(e.target.value);
										}}
									/>
									{passwordTouched && (
										<>
											<div>
												<p className="text-darkGray text-sm pb-1">
													Hints:
												</p>
												<ValidationIndicator
													message="Between 8 and 72 characters"
													isValid={passwordValidations.length}
												/>
												<ValidationIndicator
													message="Contains uppercase (AZ) and lowercase letters (az)"
													isValid={passwordValidations.upperLower}
												/>
												<ValidationIndicator
													message="Contains at least one number (0-9) or one symbol"
													isValid={
														passwordValidations.numberSpecialChar
													}
												/>
											</div>
										</>
									)}
								</div>
							)}
							{step === 2 && (
								<>
									<div className="flex flex-col gap-6">
										<InputField
											label="First Name"
											name="firstname"
											placeholder="Enter your first name"
										/>
										<InputField
											label="Last Name"
											name="lastname"
											placeholder="Enter your last name"
										/>
										<InputField
											label="Username"
											name="username"
											placeholder="Enter your username"
										/>
									</div>
									<div className="flex flex-col gap-2 text-sm">
										<p>
											Keep in sync with Edture’s community newsletter
											to receive mails on promotions, course updates,
											exclusive offers and personalized updates
										</p>
										<label>
											<Field
												type="checkbox"
												name="receiveNewsletterUpdate"
												checked={
													formikProps.values
														.receiveNewsletterUpdate
												}
												onChange={formikProps.handleChange}
											/>
											<span className="ml-2">
												{" "}
												Please contact me via email
											</span>
										</label>
									</div>
								</>
							)}
							<div className="flex flex-col gap-3 text-center">
								{step === 1 && (
									<>
										{authError && (
											<div className="text-red text-sm text-left">
												{authError}
											</div>
										)}
										<PrimaryButton
											className={`w-full`}
											onClick={() => nextStep(formikProps)}
											text={"Continue"}
											type="submit"
										/>
										<Divider />
									</>
								)}
								{step === 2 && (
									<>
										{authError && (
											<div className="text-red text-sm text-left">
												{authError}
											</div>
										)}
										<PrimaryButton
											className={`w-full`}
											type="submit"
											text={
												authLoading
													? "Creating account...."
													: "Create Account"
											}
											disabled={authLoading}
										/>
										<Divider />
									</>
								)}
								{step === 1 && (
									<p className="self-start text-left text-sm">
										Already have an account?{" "}
										<Link
											to="/tutor-signin"
											className="text-primaryBlue underline"
										>
											Sign in
										</Link>
									</p>
								)}
								{step === 2 && (
									<p className="self-start text-left text-sm">
										By clicking on create account you agree to
										Edture’s{" "}
										<Link to="#" className="text-primaryBlue">
											Terms and conditions
										</Link>{" "}
										and{" "}
										<Link to="#" className="text-primaryBlue">
											Privacy Policy
										</Link>
									</p>
								)}
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</section>
	);
};

export default TutorSignup;
