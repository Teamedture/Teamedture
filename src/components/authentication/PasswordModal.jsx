import React, { useContext, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../inputs/AuthInputs";
import { PrimaryButton } from "../Button";
import { Link, useLocation } from "react-router-dom";
import { Divider } from "../Dividers";
import logo from "/edture-logo.svg";
import resetpassword from "/reset-password-icon.svg";
import unlock from "/unlock.svg";
import lock from "/lock.svg";
import { userContext } from "../../context/UserContext";
import ValidationIndicator from "../inputs/ValidationIndicator";

export const ForgotPasswordModal = () => {
	const { success, setSuccess, loading, setLoading, error, setError } =
		useContext(userContext);

	const initialValues = {
		email: "",
	};

	const validationSchema = Yup.object({
		email: Yup.string()
			.email("Invalid email address")
			.required("Enter your email address"),
	});

	const onSubmit = async (values) => {
		try {
			setLoading(true);
			const response = await fetch(
				"https://edture.onrender.com/auth/request-password-reset",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to submit data");
			}

			const data = await response.json();
			setLoading(false);
			setSuccess(true);
			setError(null);
			console.log("Data submitted successfully:", data);
		} catch (error) {
			setLoading(false);
			setError(error.message);
			console.error("Error submitting data:", error.message);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-white w-full">
			<div className="flex flex-col mx-auto gap-3 bg-white md:min-w-[600px] p-8 border-[0.3px] border-lightGray rounded-lg">
				{success ? (
					<div className="flex flex-col gap-2 items-center text-center py-5">
						<div>
							<img src={unlock} />
						</div>
						<h2 className="font-semibold text-3xl">Check your inbox</h2>
						<p>We’ve sent an email to reset your password.</p>
					</div>
				) : (
					<>
						<div className="flex flex-col gap-2 items-center text-center py-5">
							<div>
								<img src={resetpassword} />
							</div>
							<h2 className="font-semibold text-3xl">Reset Password</h2>
							<p>We will send you the reset instructions/link.</p>
						</div>
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
						>
							{({ isSubmitting }) => (
								<Form>
									<div className="flex flex-col gap-6">
										<InputField
											label="Email Address"
											name="email"
											placeholder="Enter your email address"
										/>
										<PrimaryButton
											className="w-full"
											type="submit"
											text={
												isSubmitting
													? "Submitting..."
													: "Request reset instructions"
											}
											disabled={isSubmitting || loading}
										/>
									</div>
								</Form>
							)}
						</Formik>
					</>
				)}
				{error && (
					<div className="text-red text-sm text-center">{error}</div>
				)}
				<Link
					to="/signin"
					className="text-primaryBlue underline text-center"
				>
					Return to sign in
				</Link>
				<Divider />
				<p className="text-center">
					<Link className="text-primaryBlue underline">
						Terms and Conditions
					</Link>{" "}
					and{" "}
					<Link className="text-primaryBlue underline">
						Privacy Policy
					</Link>
				</p>
				<div className="w-[12%] self-center pt-4">
					<img src={logo} className="w-full" />
				</div>
			</div>
		</div>
	);
};

export const ResetPasswordModal = () => {
	const { success, setSuccess, loading, setLoading, error, setError } =
		useContext(userContext);

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

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	};

	const token = useQuery().get("token");

	const initialValues = {
		password: "",
	};

	const validationSchema = Yup.object({
		password: Yup.string().required("Enter your new password"),
	});

	const onSubmit = async (values) => {
		try {
			setLoading(true);
			const response = await fetch(
				"https://edture.onrender.com/auth/password-reset",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						token: token,
						password: values.password,
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData?.message?.token || "Failed to submit data"
				);
			}

			const data = await response.json();
			setLoading(false);
			setSuccess(true);
			setError(null);
			console.log("Data submitted successfully:", data);
		} catch (error) {
			setLoading(false);
			setError(error.message);
			console.error("Error submitting data:", error.message);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-white w-full">
			<div className="flex flex-col mx-auto gap-3 bg-white md:min-w-[600px] p-8 border-[0.3px] border-lightGray rounded-lg">
				{success ? (
					<div className="flex flex-col gap-2 items-center text-center py-5">
						<div>
							<img src={lock} />
						</div>
						<h2 className="font-semibold text-3xl">
							Password reset successful
						</h2>
					</div>
				) : (
					<>
						<div className="flex flex-col gap-2 items-center text-center py-5">
							<div>
								<img src={resetpassword} />
							</div>
							<h2 className="font-semibold text-3xl">
								Create new password
							</h2>
							<p>Create a new password for your account.</p>
						</div>
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
						>
							{({ isSubmitting, handleBlur, handleChange, values }) => (
								<Form>
									<div className="flex flex-col gap-6">
										<InputField
											label="New Password"
											name="password"
											type="password"
											placeholder="Create a password"
											onFocus={() => setPasswordFocused(true)}
											onBlur={(e) => {
												handleBlur(e);
												setPasswordFocused(false);
												setPasswordTouched(true);
												validatePassword(e.target.value);
											}}
											onChange={(e) => {
												handleChange(e);
												validatePassword(e.target.value);
											}}
											value={values.password}
										/>
										{(passwordFocused || passwordTouched) && (
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
														isValid={
															passwordValidations.upperLower
														}
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
										<PrimaryButton
											className="w-full"
											type="submit"
											text={
												isSubmitting
													? "Submitting..."
													: "Reset password"
											}
											disabled={isSubmitting || loading}
										/>
									</div>
								</Form>
							)}
						</Formik>
					</>
				)}
				{error && (
					<div className="text-red text-sm text-center">{error}</div>
				)}
				<Link
					to="/signin"
					className="text-primaryBlue underline text-center"
				>
					Return to sign in
				</Link>
				<Divider />
				<p className="text-center">
					<Link className="text-primaryBlue underline">
						Terms and Conditions
					</Link>{" "}
					and{" "}
					<Link className="text-primaryBlue underline">
						Privacy Policy
					</Link>
				</p>
				<div className="w-[12%] self-center pt-4">
					<img src={logo} className="w-full" />
				</div>
			</div>
		</div>
	);
};
