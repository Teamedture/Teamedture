import React from "react";
import facebook from "/icons/FB.svg";
import instagram from "/icons/IG.svg";
import twitter from "/icons/X.svg";
import linkedin from "/icons/IN.svg";

const DashFooter = () => {
	return (
		<div className="border-t-[0.4px] border-t-lightGray z-10">
			<div className="flex justify-between items-center p-6 pr-12 bg-white">
				<p className="text-lightGray">© 2024-Edture. All rights reserved.</p>
				<div className="flex gap-4 items-center">
					<img src={facebook} />
					<img src={instagram} />
					<img src={twitter} />
					<img src={linkedin} />
				</div>
			</div>
		</div>
	);
};

export default DashFooter;
