import React from 'react'

const ProgressBar = ({progress,color}) => {
  return (
		<div>
			<div className="w-full bg-lighterGray rounded-full h-1 overflow-hidden">
				<div
					className={`h-full bg-primaryBlue ${color} rounded-full`}
					style={{ width: `${progress}%` }}
				></div>
			</div>
		</div>
  );
}

export default ProgressBar
