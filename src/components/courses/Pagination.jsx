import React from "react";

const Pagination = ({ totalPages, currentPage, onClick }) => {
	const pageNumbers = [];
	const pageNumbersToShow = 3; 

	if (totalPages <= pageNumbersToShow + 1) {
		// If total pages are less than or equal to the pages to show plus the first and last pages
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i);
		}
	} else {
		// Always show the first page
		pageNumbers.push(1);

		// Calculate the range to show around the current page
		let start = Math.max(2, currentPage - 1);
		let end = Math.min(totalPages - 1, currentPage + 1);

		// Add ellipsis if the range does not start right after the first page
		if (start > 2) {
			pageNumbers.push("...");
		}

		// Add the range of pages around the current page
		for (let i = start; i <= end; i++) {
			pageNumbers.push(i);
		}

		// Add ellipsis if the range does not end right before the last page
		if (end < totalPages - 1) {
			pageNumbers.push("...");
		}

		// Always show the last page
		pageNumbers.push(totalPages);
	}

	return (
		<div className="flex justify-center mt-4">
			{pageNumbers.map((number, index) => (
				<button
					key={index}
					className={`px-3 py-1 mx-1 rounded-full ${
						number === currentPage
							? "bg-primaryBlue text-white"
							: "bg-lighterGray"
					} ${number === "..." && "cursor-default"}`}
					onClick={() => typeof number === "number" && onClick(number)}
					disabled={number === "..."}
				>
					{number}
				</button>
			))}
		</div>
	);
};

export default Pagination;
