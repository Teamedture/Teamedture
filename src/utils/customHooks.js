import { useEffect, useRef, useContext, useState } from "react";
import { userContext } from "../context/UserContext";
import { useLocation } from "react-router-dom";
import axios from "axios";

export const useApi = (url, token) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!url) {
			setLoading(false);
			return;
		}

		if (!token) {
			setLoading(false);
			return;
		}

		const fetchData = async () => {
			setLoading(true);

			try {
				const response = await axios.get(url, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});

				console.log("Fetched data:", response.data);
				setData(response.data.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error.message);
				setError(error.message);
				setLoading(false);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url, token]);

	return {
		data,
		loading,
		error,
	};
};

export const useInactivityTimeout = (timeout, setIsTimeoutModal) => {
	const { setUser, setToken } = useContext(userContext);
	const timerRef = useRef(null);
	const modalTimerRef = useRef(null);

	const excludedRoutes = [
		"/tutor-signin",
		"/student-signin",
		"/tutor-signup",
		"/student-signup",
		"/reset-password",
		"/forgot-password",
		"/",
	];

	const resetTimer = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		if (!excludedRoutes.includes(window.location.pathname)) {
			timerRef.current = setTimeout(() => {
				handleTimeout();
			}, timeout);
		}
	};

	const handleTimeout = () => {
		const role = localStorage.getItem("userRole");
		if (role) {
			localStorage.setItem(`${role}_lastLocation`, window.location.pathname);
		}
		setIsTimeoutModal("inactivity");

		if (modalTimerRef.current) {
			clearTimeout(modalTimerRef.current);
		}
		modalTimerRef.current = setTimeout(() => {
			clearSessionAndRedirect();
		}, 2 * 60 * 1000);
	};

	const clearSessionAndRedirect = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("authToken");
		localStorage.removeItem("userEmail");

		const role = localStorage.getItem("userRole");
		if (role === "TUTOR") {
			window.location.href = "/tutor-signin";
		} else {
			window.location.href = "/student-signin";
		}
		localStorage.removeItem("userRole");
	};

	useEffect(() => {
		const events = ["mousemove", "keydown", "scroll", "click"];

		const reset = () => resetTimer();

		events.forEach((event) =>
			window.addEventListener(event, reset, { passive: true })
		);

		resetTimer();

		return () => {
			events.forEach((event) => window.removeEventListener(event, reset));
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
			if (modalTimerRef.current) {
				clearTimeout(modalTimerRef.current);
			}
		};
	}, []);

	return null;
};


export const useSessionTimeout = (setIsTimeoutModal) => {
	const modalTimerRef = useRef(null);
	const { setUser, setToken } = useContext(userContext);

	const excludedRoutes = [
		"/tutor-signin",
		"/student-signin",
		"/tutor-signup",
		"/student-signup",
		"/reset-password",
		"/forgot-password",
		"/",
	];

	const clearSessionAndRedirect = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("authToken");
		localStorage.removeItem("userEmail");

		const role = localStorage.getItem("userRole");
		if (role === "TUTOR") {
			window.location.href = "/tutor-signin";
		} else {
			window.location.href = "/student-signin";
		}
		localStorage.removeItem("userRole");
	};

	useEffect(() => {
		const interceptor = axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response && error.response.status === 401) {
					if (!excludedRoutes.includes(window.location.pathname)) {
						const role = localStorage.getItem("userRole");
						if (role) {
							localStorage.setItem(
								`${role}_lastLocation`,
								window.location.pathname
							);
						}
						setIsTimeoutModal("session");

						if (modalTimerRef.current) {
							clearTimeout(modalTimerRef.current);
						}
						modalTimerRef.current = setTimeout(() => {
							clearSessionAndRedirect();
						}, 2 * 60 * 1000);
					}
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axios.interceptors.response.eject(interceptor);
			if (modalTimerRef.current) {
				clearTimeout(modalTimerRef.current);
			}
		};
	}, [setIsTimeoutModal, setUser, setToken]);

	return null;
};

