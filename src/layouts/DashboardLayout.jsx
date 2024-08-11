import React from "react";
import { TutorSideBar, StudentSideBar } from "../components/dashboard/SideBar";
import DashHeader from "../components/dashboard/DashHeader";
import DashFooter from "../components/dashboard/DashFooter";

const BaseLayout = ({ children, SidebarComponent, showFooter }) => {
	return (
		<div className="flex flex-col min-h-screen container-wrapper mx-auto">
			<div className="flex justify-between flex-grow">
					<SidebarComponent />
				<div className="flex flex-col flex-grow w-[1100px]">
					<DashHeader />
					<div className="p-6 pr-12 flex flex-col gap-8 flex-grow">{children}</div>
					{showFooter && <DashFooter />}
				</div>
			</div>
		</div>
	);
};

export const StudentDashboardLayout = ({ children, showFooter = true }) => {
	return (
		<BaseLayout SidebarComponent={StudentSideBar} showFooter={showFooter}>
			{children}
		</BaseLayout>
	);
};

export const TutorDashboardLayout = ({ children, showFooter = true }) => {
	return (
		<BaseLayout SidebarComponent={TutorSideBar} showFooter={showFooter}>
			{children}
		</BaseLayout>
	);
};
