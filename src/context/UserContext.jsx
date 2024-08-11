import React, { createContext, useState, useEffect } from "react";
import { useApi } from "../utils/customHooks";
import axios from "axios";

export const userContext = createContext();

const UserContextProvider = ({ children }) => {
	const [token, setToken] = useState(localStorage.getItem("authToken"));
	const [user, setUser] = useState(null);
	const [dashboardData, setDashboardData] = useState(null);
	const [courses, setCourses] = useState(null);
	const [enrolledCourses, setEnrolledCourses] = useState(null);
	const [studentCourses, setStudentCourses] = useState(null);
	const [courseById, setCourseById] = useState(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [authLoading, setAuthLoading] = useState(false);
	const [authError, setAuthError] = useState("");
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [role, setRole] = useState(() => localStorage.getItem("userRole"));

	// Fetch user data
	const {
		data: userData,
		loading: userLoading,
		error: userError,
	} = useApi("https://edture.onrender.com/users/profiles/my-profile", token);

	// Fetch all courses
	const {
		data: allCourses,
		loading: allCoursesLoading,
		error: allCoursesError,
	} = useApi("https://edture.onrender.com/courses", token);

	// Fetch tutor dashboard data
	const {
		data: tutorDashboardData,
		loading: tutorLoading,
		error: tutorError,
	} = useApi(
		role === "TUTOR"
			? "https://edture.onrender.com/users/tutor/dashboard"
			: null,
		token
	);

	// Fetch student dashboard data
	const {
		data: studentDashboardData,
		loading: studentLoading,
		error: studentError,
	} = useApi(
		role === "STUDENT"
			? "https://edture.onrender.com/users/dashboard/student"
			: null,
		token
	);

	// Fetch student courses
	const {
		data: studentCoursesData,
		loading: studentCoursesLoading,
		error: studentCoursesError,
	} = useApi(
		role === "STUDENT"
			? "https://edture.onrender.com/users/student/courses"
			: null,
		token
	);

	useEffect(() => {
		if (userData) {
			setUser(userData);
			if (userData?.role) {
				setRole(userData?.role);
				localStorage.setItem("userRole", userData?.role);
			}
		}
	}, [userData]);

	useEffect(() => {
		if (user?.email) {
			localStorage.setItem("userEmail", user.email);
		}
	}, [user]);

	useEffect(() => {
		if (tutorDashboardData || studentDashboardData) {
			setDashboardData(tutorDashboardData || studentDashboardData);
		}
	}, [tutorDashboardData, studentDashboardData]);

	useEffect(() => {
		if (allCourses) {
			setCourses(allCourses);
		}
	}, [allCourses]);

	useEffect(() => {
		if (studentCoursesData) {
			setStudentCourses(studentCoursesData);
			console.log("student courses", studentCoursesData);
		}
	}, [studentCoursesData]);

	useEffect(() => {
		if (token) {
			localStorage.setItem("authToken", token);
		} else {
			localStorage.removeItem("authToken");
		}
	}, [token]);

	useEffect(() => {
		if (userError || tutorError || studentError) {
			setError(userError || tutorError || studentError);
		} else {
			setError("");
		}
	}, [userError, tutorError, studentError]);

	const fetchCourseById = async (courseId) => {
		try {
			const response = await axios.get(
				`https://edture.onrender.com/courses/${courseId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setCourseById(response.data);
		} catch (error) {
			console.error("Error fetching course by ID:", error);
			setError(error.message);
		}
	};

	const logout = async () => {
		setIsLoggingOut(true);
		try {
			console.log("Logging out...");
			setTimeout(() => {
				localStorage.removeItem("authToken");
				localStorage.removeItem("userRole");
				localStorage.removeItem("userEmail");
				setUser(null);
				setDashboardData(null);
				setToken(null);
				setError("");
				setSuccess(true);
				console.log("States cleared");
			}, 1000);
		} catch (error) {
			console.error("Error during logout:", error);
			setError(error.message);
		} finally {
			setTimeout(() => {
				setIsLoggingOut(false);
				setShowLogoutModal(false);
			}, 1500);
		}
	};

	return (
		<userContext.Provider
			value={{
				token,
				setToken,
				user,
				role,
				setUser,
				firstName: user ? user.firstname : "",
				lastName: user ? user.lastname : "",
				emailAddress: user ? user.email : "",
				tutorDashboardData,
				studentDashboardData,
				dashboardData,
				setDashboardData,
				loading,
				setLoading,
				success,
				setSuccess,
				error,
				setError,
				logout,
				showLogoutModal,
				setShowLogoutModal,
				isLoggingOut,
				allCourses,
				courses,
				setCourses,
				authError,
				setAuthError,
				authLoading,
				setAuthLoading,
				fetchCourseById,
				courseById,
				enrolledCourses,
				studentCourses,
				allCoursesLoading,
				studentLoading,
				tutorLoading
			}}
		>
			{children}
		</userContext.Provider>
	);
};

export default UserContextProvider;
