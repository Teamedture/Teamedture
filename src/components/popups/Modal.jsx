import React from "react";
import { PrimaryButton, SecondaryButton } from "../Button";

export const SuccessModal = ({
	img,
	heading,
	content,
	buttonText,
	onConfirm,
	onClose,
	imageStyling,
	allowClose = true,
}) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-primaryBlack bg-opacity-50 z-50 backdrop-blur">
			<div className="bg-white flex flex-col gap-6 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full p-6 pb-8">
				{allowClose && (
					<button
						className="ml-auto bg-transparent border-0 float-right font-semibold outline-none focus:outline-none"
						onClick={onClose}
					>
						<span className="text-xl block outline-none focus:outline-none">
							&times;
						</span>
					</button>
				)}
				<div className="flex flex-col gap-3 items-center">
					<div className={` ${imageStyling}`}>
						<img src={img} className="w-full" />
					</div>
					<div className="text-center text-xl">
						<h3 className="text-3xl text-center font-semibold w-[85%] mx-auto">
							{heading}
						</h3>
						<p className="text-lg font-trap-grotesk font-medium">
							{content}
						</p>
					</div>
				</div>

				<PrimaryButton
					className="w-full"
					onClick={onConfirm}
					text={buttonText}
				/>
			</div>
		</div>
	);
};

export const ConfirmationModal = ({
	img,
	heading,
	content,
	confirmText,
	cancelText,
	onConfirm,
	onClose,
	imageStyling,
}) => {
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
					{img && (
						<div className={` ${imageStyling}`}>
							<img src={img} className="w-full" />
						</div>
					)}
					<div className="text-center text-xl">
						<h3 className="text-3xl text-center font-semibold w-[80%] mx-auto">
							{heading}
						</h3>
						<p className="text-lg font-trap-grotesk font-medium p-2">
							{content}
						</p>
					</div>
				</div>
				<div className="flex gap-3 justify-center items-center">
					<PrimaryButton
						className="w-full"
						onClick={onClose}
						text={cancelText}
					/>
					<SecondaryButton
						className="w-full"
						onClick={onConfirm}
						text={confirmText}
					/>
				</div>
			</div>
		</div>
	);
};

export const SessionTimeoutModal = ({ isOpen, onClose }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-primaryBlack bg-opacity-50 z-50 backdrop-blur">
			<div className="bg-white flex flex-col gap-3 text-center justify-center items-center rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full p-8">
				<h3 className="text-3xl text-center font-semibold w-[80%] mx-auto">
					{isOpen === "session" ? "Session Expired" : "Inactive Session"}
				</h3>
				<p className="text-lg font-trap-grotesk font-medium px-2">
					{isOpen === "session"
						? "Your session has expired. You will be logged out."
						: "You have been inactive for a while. You will be logged out."}
				</p>
				<PrimaryButton text={"Confirm"} onClick={onClose} />
			</div>
		</div>
	);
};

export const ScoreModal = ({
	img,
	score,
	content,
	onPass,
	onFail,
	onClose,
	imageStyling,
	allowClose = true,
}) => {
	const pass = score >= "50%";
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-primaryBlack bg-opacity-50 z-50 backdrop-blur">
			<div className="bg-white flex flex-col gap-6 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full p-10">
				{allowClose && (
					<button
						className="ml-auto bg-transparent border-0 float-right font-semibold outline-none focus:outline-none"
						onClick={onClose}
					>
						<span className="text-xl block outline-none focus:outline-none">
							&times;
						</span>
					</button>
				)}
				<div className="flex flex-col gap-3 items-center">
					{img && (
						<div className={` ${imageStyling}`}>
							<img src={img} className="w-full" />
						</div>
					)}

					<div className="text-center flex flex-col gap-2">
						<p className="text-2xl font-trap-grotesk font-medium">
							{pass ? "Kudos!" : "You can do better next time"}
						</p>
						<p className="text-2xl font-trap-grotesk font-medium">
							{content}
						</p>
						{score && (
							<h3 className="text-6xl text-center font-semibold w-[80%] mx-auto">
								{score}%
							</h3>
						)}
					</div>
				</div>

				<PrimaryButton
					className="w-full"
					onClick={pass ? onPass : onFail}
					text={pass ? "Continue" : "Back to courses"}
				/>
			</div>
		</div>
	);
};
