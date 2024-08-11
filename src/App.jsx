import React, { useState } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useNavigate,
} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.css";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import StudentSignin from "./pages/StudentSignin";
import TutorSignin from "./pages/TutorSignin";
import StudentSignup from "./pages/StudentSignup";
import TutorSignup from "./pages/TutorSignup";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkout from "./pages/Checkout";
import AllCourses from "./pages/AllCourses";
import CourseContent from "./pages/CourseContent";
import Chat from "./pages/Chat";
import { SessionTimeoutModal } from "./components/popups/Modal";
import { useSessionTimeout, useInactivityTimeout } from "./utils/customHooks";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import OurCourses from "./pages/OurCourses";

const App = () => {
	const [isTimeoutModal, setIsTimeoutModal] = useState(null);

	// Session timeout hook
	useSessionTimeout(setIsTimeoutModal);

	// Inactivity timeout hook
	useInactivityTimeout(30 * 60 * 1000, setIsTimeoutModal);

	const handleCloseModal = () => {
		setIsTimeoutModal(null);
		localStorage.removeItem("authToken");
		const role = localStorage.getItem("userRole");

		if (role === "TUTOR") {
			window.location.href = "/tutor-signin";
		} else {
			window.location.href = "/student-signin";
		}
	};

	return (
		<Router>
			<div className="mx-auto container-wrapper">
				<SessionTimeoutModal
					isOpen={isTimeoutModal}
					onClose={handleCloseModal}
				/>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/student-signin" element={<StudentSignin />} />
					<Route path="/student-signup" element={<StudentSignup />} />
					<Route path="/tutor-signin" element={<TutorSignin />} />
					<Route path="/tutor-signup" element={<TutorSignup />} />
					<Route path="/reset-password" element={<ResetPassword />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route
						path="/student-dashboard"
						element={<StudentDashboard />}
					/>
					<Route path="/tutor-dashboard" element={<TutorDashboard />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/courses" element={<Courses />} />
					<Route path="/courses/:id" element={<CourseDetails />} />
					<Route path="/courses/:id/quiz" element={<Quiz />} />
					<Route
						path="/courses/course-content/:id"
						element={<CourseContent />}
					/>
					<Route path="/cart" element={<Cart />} />
					<Route path="/checkout" element={<Checkout />} />
					<Route path="/allcourses" element={<AllCourses />} />
					<Route path="/ourcourses" element={<OurCourses />} />
					<Route path="/courses/:id/chat" element={<Chat />} />
				</Routes>
				<ToastContainer />
			</div>
		</Router>
	);
};

export default App;
