// VideoComponent.jsx
import React from "react";

const VideoComponent = React.memo(({ url }) => {
	const handleContextMenu = (e) => e.preventDefault();
	return (
		<div className="w-full py-6">
			<video
				controls
				className="w-full rounded-lg"
				src={url}
				type="video/mp4"
				onContextMenu={handleContextMenu}
			></video>
		</div>
	);
});

export default VideoComponent;
