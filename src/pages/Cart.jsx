import React, { useContext, useState } from "react";
import CourseDetailsLayout from "../layouts/CourseDetailsLayout";
import RecommendedCourses from "../components/courses/RecommendedCourses";
import { userContext } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import CartCard from "../components/cards/CartCard";
import { ConfirmationModal } from "../components/popups/Modal";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../components/Button";
import { SpinnerLoader } from "../components/Loader";
import { formatPriceWithCommas } from "../utils/utils";

const Cart = () => {
	const { allCourses } = useContext(userContext);
	const { cartItems, removeItemFromCart, clearCart, cartLoading } = useCart();

	const calculateTotalPrice = (items) => {
		if (items.length === 0) return { total: 0, currency: "" };

		const totalPrice = items.reduce((acc, item) => acc + item.price, 0);
		const currency = items[0].currency;
		return { totalPrice, currency };
	};

	const { totalPrice, currency } = calculateTotalPrice(cartItems);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [itemToRemove, setItemToRemove] = useState(null);

	const handleRemoveClick = (item) => {
		setItemToRemove(item);
		setIsModalOpen(true);
	};

	const handleConfirmRemove = async () => {
		if (itemToRemove) {
			await removeItemFromCart(itemToRemove);
			setItemToRemove(null);
		}
		setIsModalOpen(false);
	};

	const courseText = cartItems?.length > 1 ? "course" : "course";
	const recommendedCourses = allCourses?.courses.slice(0, 4);
	return (
		<div className="relative">
			<CourseDetailsLayout>
				{cartLoading && <SpinnerLoader />}
				{cartItems?.length === 0 ? (
					<h3 className="font-medium text-2xl px-12">
						Your cart is empty
					</h3>
				) : (
					<div>
						<div className="px-12 py-10 flex flex-col gap-3">
							<div>
								<h3 className="text-2xl font-semibold">Cart</h3>
								<p className="font-trap-grotesk text-lg font-medium">
									You have {cartItems?.length} {courseText} in cart
								</p>
							</div>

							<div className="flex flex-col gap-3 divide-y divide-lightGray border-t border-b border-lightGray w-[60%]">
								{cartItems?.map((item) => (
									<CartCard
										key={item.id}
										course={item}
										onRemove={() => handleRemoveClick(item)}
									/>
								))}
							</div>
						</div>
						<CheckoutModal
							totalPrice={formatPriceWithCommas(totalPrice)}
							currency={currency}
						/>
					</div>
				)}
				<RecommendedCourses
					heading={"You might also like"}
					courses={recommendedCourses}
					styleClass="px-12 py-10"
				/>
			</CourseDetailsLayout>
			{isModalOpen && itemToRemove && (
				<ConfirmationModal
					heading="Confirm Removal"
					content={`Are you sure you want to remove this course from your cart?`}
					cancelText="Cancel"
					confirmText="Confirm"
					onConfirm={handleConfirmRemove}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
};

export default Cart;

const CheckoutModal = ({ currency, totalPrice }) => {
	const navigate = useNavigate();

	const handleProceed = () => {
		navigate("/checkout");
	};

	return (
		<div className="absolute top-32 right-14 p-4 w-full max-w-[400px] bg-white shadow-lg z-20 rounded-lg font-trap-grotesk">
			<div className="mb-4">
				<p className="text-lg text-lightGray font-trap-grotesk font-medium">
					Total:
				</p>
				<p className="text-2xl font-semibold font-trap-grotesk">
					{currency} {formatPriceWithCommas(totalPrice)}
				</p>
			</div>
			<PrimaryButton
				text={"Proceed to checkout"}
				className="w-full"
				onClick={handleProceed}
			/>
		</div>
	);
};
