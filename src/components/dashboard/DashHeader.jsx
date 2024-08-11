import React, { useState, useContext } from "react";
import inbox from "/inbox.svg";
import search from "/icons/search.svg";
import cart from "/icons/shopping-cart.svg";
import notification from "/icons/notification.svg";
import ProfilePopup from "../popups/ProfilePopup";
import NotificationPopup from "../popups/NotificationPopup";
import InboxPopup from "../popups/InboxPopup";
import CartPopup from "../popups/CartPopup";
import { userContext } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";

const DashHeader = () => {
	const { firstName, lastName, emailAddress, user } = useContext(userContext);
	const { cartItems } = useCart();

	const initials =
		firstName && lastName ? `${firstName[0]}${lastName[0]}` : "HH";

	const [popups, setPopups] = useState({
		profile: false,
		notification: false,
		inbox: false,
		cart: false,
	});

	const role = user?.role;

	const handlePopup = (popupName) => {
		setPopups((prevPopups) => {
			const newPopups = Object.keys(prevPopups).reduce((acc, key) => {
				acc[key] = key === popupName ? !prevPopups[key] : false;
				return acc;
			}, {});
			return newPopups;
		});
	};

	return (
		<div className="bg-white border-b-[0.5px] border-b-lightGray p-6 pr-12 sticky z-30 top-0">
			<div className="flex justify-between gap-3">
				<div className="flex gap-3 border p-2 border-lightGray rounded-lg w-[78%]">
					<img src={search} />
					<input
						className="text-darkGray placeholder:text-lightGray w-full focus:border-none focus:outline-none"
						placeholder="Search for anything"
					/>
				</div>
				<div className="flex gap-5 items-center">
					<img
						src={inbox}
						onClick={() => handlePopup("inbox")}
						className="cursor-pointer"
					/>
					<img
						src={notification}
						onClick={() => handlePopup("notification")}
						className="cursor-pointer"
					/>
					{role !== "TUTOR" && (
						<div
							className="relative flex items-center cursor-pointer"
							onClick={() => handlePopup("cart")}
						>
							<img src={cart} alt="Cart Icon" />
							{cartItems && (
								<span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-primaryBlue min-w-6 min-h-6 max-w-8 max-h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm">
									{cartItems.length}
								</span>
							)}
						</div>
					)}
					<div className="h-5 w-[1px] bg-darkGray"></div>
					<div
						className="bg-primaryBlue rounded-full p-2 text-white uppercase w-10 h-10 text-center cursor-pointer flex items-center justify-center"
						onClick={() => handlePopup("profile")}
					>
						{initials}
					</div>
					{popups.profile && (
						<ProfilePopup
							firstName={firstName}
							lastName={lastName}
							email={emailAddress}
							initials={initials}
						/>
					)}
					{popups.notification && <NotificationPopup />}
					{popups.inbox && <InboxPopup />}
					{popups.cart && <CartPopup />}
				</div>
			</div>
		</div>
	);
};

export default DashHeader;
