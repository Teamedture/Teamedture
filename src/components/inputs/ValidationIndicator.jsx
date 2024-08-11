import React from "react";
import checkmark from "/checkmark-green.svg";
import errorcheck from "/error-check.svg";

const ValidationIndicator = ({ message, isValid }) => {
	return (
		<div className="flex items-center gap-2 pb-1">
			{isValid ? <img src={checkmark} /> : <img src={errorcheck} />}
			{isValid ? (
				<span className="text-sm text-green">{message}</span>
			) : (
				<span className="text-sm text-red">{message}</span>
			)}
		</div>
	);
};

export default ValidationIndicator;
