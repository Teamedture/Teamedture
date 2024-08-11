import React from "react";
import lock from "/lock.svg";
import unlock from "/unlock.svg";
import { PrimaryButton, SecondaryButton } from "../Button";

const LogoutModal = ({ show, onClose, onConfirm, isLoading }) => {
	if (!show) {
		return null;
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-primaryBlack bg-opacity-50 z-50 backdrop-blur">
			<div className="bg-white flex flex-col gap-6 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full p-6 pb-8">
				<button
					className="ml-auto bg-transparent border-0 float-right font-semibold outline-none focus:outline-none"
					onClick={onClose}
				>
					<span className="text-xl block outline-none focus:outline-none">
						&times;
					</span>
				</button>
				<div className="flex flex-col gap-3 items-center">
					<div>
						<img src={unlock} />
					</div>
					<h3 className="text-3xl text-center font-semibold">Logout</h3>
					<div className="text-center text-xl">
						{isLoading ? (
							<p className="text-lg">
								Please wait, logging out...
							</p>
						) : (
							<p className="text-lg">Are you sure you want to logout?</p>
						)}
					</div>
				</div>

				<div className="flex w-4/5 mx-auto items-center justify-center gap-6">
					<SecondaryButton
						className="w-full"
						onClick={onClose}
						disabled={isLoading}
						text={"Cancel"}
					/>
					<PrimaryButton
						className="w-full"
						onClick={onConfirm}
						disabled={isLoading}
						text={isLoading ? "Logging out..." : "Proceed"}
					/>
				</div>
			</div>
		</div>
	);
};

export default LogoutModal;
