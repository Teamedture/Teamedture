import React, { useContext } from "react";
import dashboardbanner from "/dashboard-banner.svg";
import { userContext } from "../../context/UserContext";

const DashboardBanner = ({ className, role, isNewUser }) => {
	const { firstName } = useContext(userContext);

	const renderBannerContent = () => {
		let greeting = isNewUser
			? `Hello ${firstName}, `
			: `Welcome back, ${firstName} `;
		let actionText = isNewUser
			? role === "STUDENT"
				? "Explore courses to begin"
				: "Create your first course"
			: role === "STUDENT"
			? "Resume learning"
			: "Resume teaching";
		let bannerImage = role === "STUDENT" ? dashboardbanner : dashboardbanner;

		return (
			<div className="bg-primaryBlue flex justify-between rounded-xl text-white pl-12">
				<div className="flex flex-col justify-center">
					<h3 className="text-3xl font-semibold capitalize">{greeting}</h3>
					<p className="text-2xl font-trap-grotesk">{actionText}</p>
				</div>
				<div className="p-0">
					<img src={bannerImage} alt="Dashboard Banner" />
				</div>
			</div>
		);
	};

	return <div className={className}>{renderBannerContent()}</div>;
};

export default DashboardBanner;
