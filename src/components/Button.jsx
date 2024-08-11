export const PrimaryButton = ({ text, className, onClick, type, disabled }) => {
	return (
		<div>
			<button
				disabled={disabled}
				type={type}
				onClick={onClick}
				className={`rounded-lg text-lg p-2 py-3 md:py-3 md:px-6 transition-all ease-in cursor-pointer font-trap-grotesk font-medium tracking-tight ${className} ${
					disabled
						? "bg-lighterGray text-lightGray cursor-not-allowed"
						: "bg-primaryBlue hover:bg-hoverBlue text-white"
				}`}
			>
				{text}
			</button>
		</div>
	);
};

export const SecondaryButton = ({
	text,
	className,
	onClick,
	disabled,
	icon,
	hoverClass = "hover:bg-secondaryHoverBlue",
}) => {
	return (
		<div>
			<button
				onClick={onClick}
				className={`rounded-lg text-base bg-transparent border border-bg-primaryBlue text-primaryBlue p-2 md:py-3 md:px-6 ${hoverClass} cursor-pointer transition-all ease-in font-trap-grotesk font-medium tracking-tight ${className}`}
			>
				{icon && <img src={icon} className="w-5" />}
				{text}
			</button>
		</div>
	);
};

export const IconButton = ({ text, className, onClick, icon }) => {
	return (
		<div>
			<button
				onClick={onClick}
				className={`gap-2 flex justify-center items-center rounded-lg p-2 md:py-3 md:px-5 bg-secondaryHoverBlue hover:border-primaryBlue border-dashed border-primaryBlue border text-primaryBlue cursor-pointer font-trap-grotesk tracking-tight transition-all ease-in ${className}`}
			>
				<img src={icon} className="w-5" />
				<span className="font-trap-grotesk">{text}</span>
			</button>
		</div>
	);
};

export const GoogleButton = ({ text, className, onClick, icon, id }) => {
	return (
		<div id={id}>
			<a
				onClick={onClick}
				className={`gap-2 flex justify-center items-center rounded-lg p-2 py-3 md:py-4 md:px-5 text-base bg-transparent hover:border-primaryBlue border border-lightGray text-darkGray cursor-pointer transition-all ease-in ${className}`}
			>
				<img src={icon} className="w-5" />
				<span>{text}</span>
			</a>
		</div>
	);
};
