import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../components/inputs/AuthInputs";
import { PrimaryButton } from "../components/Button";
import { Link } from "react-router-dom";
import { Divider } from "../components/Dividers";
import logo from "/edture-logo.svg";
import resetpassword from "/reset-password-icon.svg";
import { ForgotPasswordModal } from "../components/authentication/PasswordModal";

const ForgotPassword = () => {
	return (
		<div className="">
			<ForgotPasswordModal />
		</div>
	);
};

export default ForgotPassword;
