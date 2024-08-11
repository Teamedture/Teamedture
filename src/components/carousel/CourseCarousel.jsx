import React from "react";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import arrowright from "/icons/arrow-right.svg";
import arrowleft from "/icons/arrow-left.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ onClick }) => (
	<div
		className="bg-white shadow absolute -right-5 top-1/2 transform -translate-y-1/2 p-1 z-10 rounded-full cursor-pointer"
		onClick={onClick}
	>
		<img src={arrowright} />
	</div>
);

const PrevArrow = ({ onClick }) => (
	<div
		className="bg-white shadow absolute -left-5 top-1/2 transform -translate-y-1/2 z-10 p-1 rounded-full cursor-pointer"
		onClick={onClick}
	>
		<img src={arrowleft} />
	</div>
);

const CourseCarousel = ({
	children,
	className,
	slidesToShow = 3,
	autoplay = true,
	flowDirection = "ltr",
}) => {
	const settings = {
		infinite: true,
		speed: 500,
		autoplay: autoplay,
		rtl: flowDirection,
		autoplaySpeed: 2500,
		slidesToShow: slidesToShow,
		slidesToScroll: 1,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: slidesToShow > 2 ? 3 : slidesToShow,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: slidesToShow > 1 ? 2 : slidesToShow,
					slidesToScroll: 1,
				},
			},
		],
	};

	return (
		<div className={`course-carousel ${className}`}>
			<Slider {...settings}>{children}</Slider>
		</div>
	);
};

export default CourseCarousel;
