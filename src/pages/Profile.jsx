import React, { useContext } from "react";
import {
	TutorDashboardLayout,
	StudentDashboardLayout,
} from "../layouts/DashboardLayout";
import { userContext } from "../context/UserContext";

const Profile = () => {
	const { user, firstName, lastName, emailAddress } = useContext(userContext);
	const role = user?.role;
	const initials =
		firstName && lastName ? `${firstName[0]}${lastName[0]}` : "FN";

	const studentContent = (
		<>
			<div className="flex flex-col gap-8">
				<h3 className="text-2xl font-semibold">Personal Details</h3>
				<div className="flex justify-start gap-12">
					<div className="bg-primaryBlue text-white text-6xl font-trap-grotesk font-semibold flex flex-grow-0 justify-center items-center text-center w-64 max-w-80 h-64 rounded-full uppercase">
						{initials}
					</div>
					<div className="flex flex-col gap-3 border border-lightGray rounded-lg p-6 text-darkGray w-96">
						<div>
							<h3 className="font-medium">First Name</h3>
							<p className="text-lightGray">{firstName}</p>
						</div>
						<div>
							<h3 className="font-medium">Last Name</h3>
							<p className="text-lightGray">{lastName}</p>
						</div>
						<div>
							<h3 className="font-medium">User Name</h3>
							<p className="text-lightGray">{user?.username}</p>
						</div>
						<div>
							<h3 className="font-medium">Email Address</h3>
							<p className="text-lightGray">{emailAddress}</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);

	const tutorContent = (
		<>
			<div className="flex flex-col gap-8">
				<h3 className="text-2xl font-semibold">Personal Details</h3>
				<div className="flex justify-start gap-12">
					<div className="bg-primaryBlue text-white text-6xl font-trap-grotesk font-semibold flex flex-grow-0 justify-center items-center text-center w-64 max-w-80 h-64 rounded-full uppercase">
						{initials}
					</div>
					<div className="flex flex-col gap-3 border border-lightGray rounded-lg p-6 text-darkGray w-96">
						<div>
							<h3 className="font-medium">First Name</h3>
							<p className="text-lightGray">{firstName}</p>
						</div>
						<div>
							<h3 className="font-medium">Last Name</h3>
							<p className="text-lightGray">{lastName}</p>
						</div>
						<div>
							<h3 className="font-medium">User Name</h3>
							<p className="text-lightGray">{user?.username}</p>
						</div>
						<div>
							<h3 className="font-medium">Email Address</h3>
							<p className="text-lightGray">{emailAddress}</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);

	const Layout =
		role === "STUDENT" ? StudentDashboardLayout : TutorDashboardLayout;

	return <Layout>{role === "STUDENT" ? studentContent : tutorContent}</Layout>;
};

export default Profile;
