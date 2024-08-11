import React, { useContext, useState, useEffect } from "react";
import CourseDetailsLayout from "../layouts/CourseDetailsLayout";
import { userContext } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../components/Button";
import { Divider } from "../components/Dividers";
import InputField from "../components/inputs/AuthInputs";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { SuccessModal } from "../components/popups/Modal";
import { formatPriceWithCommas } from "../utils/utils";
import successgif from "/success-gif.gif";

const Checkout = () => {
	const { user, token } = useContext(userContext);
	const { cartItems, clearCartItems, fetchCartItems } = useCart();
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [flutterwaveTransactionId, setFlutterwaveTransactionId] = useState("");
	const [txRef, setTxRef] = useState(`txn-${Date.now()}`);
	const [transactionReady, setTransactionReady] = useState(false);

	const navigate = useNavigate();

	// useEffect(() => {
	const storedEmail = localStorage.getItem("userEmail");
	// }, [user]);

	const initialValues = {
		email: storedEmail,
		firstname: "",
		lastname: "",
		country: "",
		state: "",
		address: "",
	};

	useEffect(() => {
		if (transactionReady && flutterwaveTransactionId) {
			handleSubmit();
		}
	}, [transactionReady, flutterwaveTransactionId]);

	const validationSchema = Yup.object({
		firstname: Yup.string().required("First name is required"),
		lastname: Yup.string().required("Last name is required"),
		country: Yup.string().required("Country is required"),
		state: Yup.string().required("State is required"),
		address: Yup.string().required("Address is required"),
	});

	const handleSubmit = async () => {
		setIsLoading(true);

		const { totalPrice, currency } = calculateTotalPrice(cartItems);

		try {
			const response = await axios.post(
				"https://edture.onrender.com/transactions",
				{
					courseIds: cartItems.map((item) => item.id),
					totalPrice,
					transactionRef: txRef,
					fltwvTransactionId: flutterwaveTransactionId,
					currency,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = response.data;
			console.log(data);

			if (data.statusCode === 201) {
				setShowSuccess(true);
				fetchCartItems();
				clearCartItems();
			}
		} catch (error) {
			console.error("Error during checkout:", error);
			console.log("Payload", values);
		} finally {
			setIsLoading(false);
		}
	};

	const makePayment = (values) => {
		FlutterwaveCheckout({
			public_key: "FLWPUBK_TEST-2ade44ff4aa3b9c7035733feed27d570-X",
			tx_ref: txRef,
			amount: calculateTotalPrice(cartItems).totalPrice,
			currency: calculateTotalPrice(cartItems).currency,
			payment_options: "card, mobilemoneyghana, ussd",
			meta: {
				consumer_id: user?.id || 23,
				consumer_mac: "92a3-912ba-1192a",
			},
			customer: {
				email: values.email,
				phone_number: user?.phone || "07058333009",
				name: `${values.firstname} ${values.lastname}`,
			},
			customizations: {
				title: "Course Purchase",
				description: "Payment for purchased courses",
				logo: "/edture-logo.svg",
			},
			callback: function (data) {
				console.log("Flutterwave callback data:", data);
				if (data) {
					const transactionId = data?.transaction_id.toString();
					console.log("Transaction ID:", transactionId);
					setFlutterwaveTransactionId(transactionId);
					console.log("Transaction ID:", flutterwaveTransactionId);
					setTransactionReady(true);
				} else {
					console.error("Payment failed:", data);
				}
			},
			onclose: function () {
				console.log("Payment modal closed");
			},
		});
	};

	const calculateTotalPrice = (items) => {
		if (items.length === 0) return { totalPrice: 0, currency: "" };

		const totalPrice = items.reduce((acc, item) => acc + item.price, 0);
		const currency = items[0].currency;
		return { totalPrice, currency };
	};

	const { totalPrice, currency } = calculateTotalPrice(cartItems);

	const handleStartLearning = async () => {
		clearCartItems();
		navigate("/student-dashboard");
		// window.location.reload();
	};

	return (
		<div>
			{showSuccess && (
				<SuccessModal
					allowClose={false}
					heading={"Payment Successful"}
					buttonText={"Start Learning"}
					onConfirm={handleStartLearning}
					img={successgif}
				/>
			)}
			<CourseDetailsLayout>
				<div className="flex flex-col">
					<div className="px-12 py-10 flex flex-col gap-6">
						<div>
							<h3 className="text-2xl font-semibold py-2">Checkout</h3>
							<p className="font-trap-grotesk text-lg font-medium">
								Billing Details
							</p>
						</div>

						<div className="w-[60%]">
							<Formik
								initialValues={initialValues}
								validationSchema={validationSchema}
								onSubmit={(values) => {
									makePayment(values);
								}}
							>
								{({ touched, errors }) => (
									<Form className="flex flex-col gap-5">
										<InputField
											type="email"
											name="email"
											label="Email address"
											disabled
										/>
										<div className="flex justify-between items-start gap-3">
											<InputField
												label="First Name"
												name="firstname"
												placeholder="Enter your first name"
												error={
													touched.firstname && errors.firstname
												}
											/>
											<InputField
												label="Last Name"
												name="lastname"
												placeholder="Enter your last name"
												error={touched.lastname && errors.lastname}
											/>
										</div>
										<div className="flex justify-between items-start gap-3">
											<InputField
												label="Country/Region"
												name="country"
												placeholder="Country"
												error={touched.country && errors.country}
											/>
											<InputField
												label="State/County"
												name="state"
												placeholder="State"
												error={touched.state && errors.state}
											/>
										</div>
										<InputField
											label="Street address"
											name="address"
											placeholder="Address"
											error={touched.address && errors.address}
										/>
										<CheckoutModal
											currency={currency}
											totalPrice={totalPrice}
											isLoading={isLoading}
										/>
									</Form>
								)}
							</Formik>
						</div>

						<div>
							<h3 className="text-2xl font-semibold py-2">
								Order details
							</h3>
							<div className="flex flex-col gap-2 w-[60%]">
								{cartItems?.map((item, index) => (
									<div
										className="flex justify-between items-center"
										key={index}
									>
										<div className="flex items-center gap-3">
											<img
												src={item.image}
												className="w-12 h-12 rounded object-cover"
											/>
											<h6 className="font-trap-grotesk font-semibold">
												{item.title}
											</h6>
										</div>
										<p className="font-trap-grotesk font-semibold">
											NGN {formatPriceWithCommas(item.price)}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</CourseDetailsLayout>
		</div>
	);
};

export default Checkout;

const CheckoutModal = ({ totalPrice, currency, isLoading }) => {
	return (
		<div className="fixed top-32 right-14 p-4 w-full max-w-[400px] bg-white shadow-lg z-20 rounded-lg font-trap-grotesk">
			<div>
				<h3 className="text-2xl font-semibold">Order Summary</h3>
				<div className="flex justify-between items-center mb-4">
					<p className="text-lg text-lightGray font-trap-grotesk font-medium">
						Subtotal:
					</p>
					<p className="text-lg font-semibold font-trap-grotesk text-lightGray">
						{currency} {formatPriceWithCommas(totalPrice?.toFixed(2))}
					</p>
				</div>
			</div>
			<Divider />
			<div className="flex justify-between items-center my-4">
				<p className="text-lg text-lightGray font-trap-grotesk font-medium">
					Total:
				</p>
				<p className="text-2xl font-semibold font-trap-grotesk">
					{currency} {formatPriceWithCommas(totalPrice?.toFixed(2))}
				</p>
			</div>
			<div className="flex flex-col gap-2 pb-5">
				<p className="text-sm text-lightGray">
					We collect and use your personal information to fulfill orders,
					personalize your experience on our website, and as otherwise
					described in our privacy policy
				</p>
				<div className="flex gap-2 items-center">
					<input type="checkbox" required />
					<p className="text-xs text-darkGray opacity-70">
						I agree to the{" "}
						<a href="#" className="text-primary">
							terms and conditions
						</a>
					</p>
				</div>
			</div>
			<PrimaryButton
				text={isLoading ? "Loading..." : "Complete Payment"}
				className="w-full justify-center"
				disabled={isLoading}
				type="submit"
			/>
		</div>
	);
};
