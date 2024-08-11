import React from "react";
import { Divider } from "../Dividers";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPriceWithCommas } from "../../utils/utils";

const CartPopup = () => {
	const { cartItems } = useCart();
	return (
		<div className="fixed shadow bg-white rounded-lg top-24 right-[3%] w-72">
			<div className="flex justify-between items-center p-4 pb-2 gap-4">
				<p className="font-trap-grotesk font-semibold">Cart</p>
				<Link
					className="text-primaryBlue font-trap-grotesk font-medium text-sm"
					to="/cart"
				>
					Checkout
				</Link>
			</div>
			<Divider />
			<div className="flex flex-col gap-3 p-4 pt-2 text-center">
				{cartItems.length === 0 ? (
					<div className="bg-[#fff6ff] py-4 px-3 rounded-lg">
						Your cart is empty
					</div>
				) : (
					<div className="flex flex-col divide-y divide-lightGray border-lightGray gap-2">
						{cartItems.map((items) => {
							return (
								<div className="flex gap-3 pt-2">
									<div className="w-12">
										<img
											src={items.image}
											className="object-cover rounded"
										/>
									</div>
									<div className="flex flex-col items-start">
										<h3 className="font-medium text-sm">
											{items.title}
										</h3>
										<h3 className="font-medium text-xs">
											NGN {formatPriceWithCommas(items.price)}
										</h3>
									</div>
								</div>
							);
						})}
					</div>
				)}
				<Link
					to="/allcourses"
					className="text-primaryBlue text-center font-trap-grotesk font-medium"
				>
					Explore Courses
				</Link>
			</div>
		</div>
	);
};

export default CartPopup;
