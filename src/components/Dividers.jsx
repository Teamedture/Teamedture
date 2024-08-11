import React from "react";

export const DividerWithText = ({ text = "or" }) => {
	return (
		<div className="flex items-center justify-center">
			<hr className="flex-grow border-lightGray" />
			<span className="mx-2 text-darkGray">{text}</span>
			<hr className="flex-grow border-lightGray" />
		</div>
	);
};

export const Divider = ({ text = "or" }) => {
	return (
		<div className="flex items-center justify-center my-2">
			<hr className="flex-grow border-lightGray" />
		</div>
	);
};
