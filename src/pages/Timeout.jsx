import { useEffect, useRef, useContext } from "react";
import { userContext } from "../context/UserContext";

const useInactivityTimeout = (timeout, setIsTimeoutModalOpen, navigate) => {
	const { user, setUser, setToken } = useContext(userContext);
	const timerRef = useRef(null);

	const resetTimer = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		timerRef.current = setTimeout(() => {
			handleTimeout();
		}, timeout);
	};

	const handleTimeout = () => {
		localStorage.setItem("lastLocation", window.location.pathname);
		localStorage.removeItem("authToken");
		setUser(null);
		setToken(null);
		setIsTimeoutModalOpen(true);
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
		};
	}, [user]);

	return null;
};

export default useInactivityTimeout;
