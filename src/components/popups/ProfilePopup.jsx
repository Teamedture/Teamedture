import React, { useContext } from "react";
import { userContext } from "../../context/UserContext";
import { Divider } from "../Dividers";
import { NavLink, useNavigate } from "react-router-dom";
import profile from "/profile.svg";
import logouticon from "/logout.svg";
import settings from "/settings.svg";
import help from "/icons/help.svg";
import certificate from "/icons/certificate.svg";
import wallet from "/icons/wallet.svg";
import LogoutModal from "../authentication/LogoutModal";

const ProfilePopup = ({ initials, firstName, lastName, email }) => {
	const { setShowLogoutModal, logout, showLogoutModal, isLoggingOut, user } =
		useContext(userContext);

	const navigate = useNavigate();
	const role = user?.role;

	const handleLogout = async () => {
		await logout();

		setTimeout(() => {
			if (role === "TUTOR") {
				navigate("/tutor-signin");
			} else {
				navigate("/student-signin");
			}
		}, 2000);
	};

	return (
		<div className="fixed shadow bg-white rounded-lg top-24 right-[3%] w-72">
			<div className="flex justify-start items-center p-4 pb-2 gap-4">
				<div className="bg-primaryBlue rounded-full p-2 text-white uppercase w-10 h-10 text-center">
					{initials}
				</div>
				<div>
					<p className="font-trap-grotesk font-semibold capitalize">{`${firstName} ${lastName}`}</p>
					<p className="text-lightGray">{email}</p>
				</div>
			</div>
			<Divider />
			<div className="p-4 pt-0">
				<ProfileLink icon={profile} label={"Profile"} to="/profile" />
				{role !== "TUTOR" && (
					<div>
						<ProfileLink
							icon={certificate}
							label={"Certificates"}
							to=""
						/>
						<ProfileLink
							icon={wallet}
							label={"My Purchases"}
							to=""
						/>
					</div>
				)}
				<ProfileLink icon={settings} label={"Settings"} to="" />
				<ProfileLink icon={help} label={"Help"} to="" />
				<ProfileLink
					icon={logouticon}
					label={"Logout"}
					to="/logout"
					onClick={() => setShowLogoutModal(true)}
				/>
			</div>
			{showLogoutModal && (
				<LogoutModal
					show={showLogoutModal}
					onClose={() => setShowLogoutModal(false)}
					onConfirm={handleLogout}
					isLoading={isLoggingOut}
				/>
			)}
		</div>
	);
};

export default ProfilePopup;

const ProfileLink = ({ to, icon, label, onClick }) => {
	if (to === "/logout") {
		return (
			<div
				onClick={onClick}
				className={`group cursor-pointer flex flex-start gap-4 text-lg items-center p-2 px-3 w-full transition duration-300 ease-in-out hover:text-primaryBlue`}
			>
				<img src={icon} alt={label} className="w-6 h-6" />
				<span>{label}</span>
			</div>
		);
	}
	return (
		<NavLink
			to={to}
			className={`group flex flex-start gap-4 text-lg items-center p-2 px-3 w-full transition duration-300 ease-in-out hover:text-primaryBlue`}
		>
			<img src={icon} alt={label} className="w-6 h-6" />
			<span>{label}</span>
		</NavLink>
	);
};
