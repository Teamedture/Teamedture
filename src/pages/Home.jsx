import React, { useContext } from "react";
import Navbar from "../components/courses/Navbar";
import CourseFooter from "../components/courses/CourseFooter";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import { useNavigate } from "react-router-dom";
import community from "/community-home.svg";
import bridging from "/bridging-home.svg";
import CourseCarousel from "../components/carousel/CourseCarousel";
import { CourseCard } from "../components/cards/CourseCard";
import { userContext } from "../context/UserContext";
import { SpinnerLoader } from "../components/Loader";

const Home = () => {
	const { allCourses, allCoursesLoading } = useContext(userContext);

	const navigate = useNavigate();
	const handleSignIn = () => {
		navigate("/student-signin");
	};

	const handleSignUp = () => {
		navigate("/student-signup");
	};

	const goToCourses = () => {
		navigate("/ourcourses");
	};

	return (
		<div className="flex flex-col w-full min-h-screen">
			<Navbar />
			<div className="flex flex-col gap-12 flex-grow px-10 py-12">
				<div
					className="bg-darkBlue p-16 py-24 rounded-lg flex flex-col justify-center items-center gap-5 text-white"
					style={{ backgroundImage: "url('/course-banner.svg')" }}
				>
					<div className="rounded-full p-3 px-6 border border-lighterGray bg-[#222B80]">
						Discover, Learn and Master 💡
					</div>
					<h2 className="font-trap-grotesk text-7xl font-semibold text-white text-center w-[70%] mx-auto">
						Empower your future with emerging technologies.
					</h2>
					<p className="text-xl text-white font-trap-grotesk">
						Tailored courses for educators and learners.
					</p>
					<div className="flex gap-3 justify-center items-center">
						<PrimaryButton
							text={"Start Learning"}
							className="w-full whitespace-nowrap"
							onClick={handleSignUp}
						/>
						<SecondaryButton
							text={"Sign in"}
							className={"w-full whitespace-nowrap text-white "}
							hoverClass="hover:bg-darkBlue"
							onClick={handleSignIn}
						/>
					</div>
				</div>

				{/* ABOUT US */}
				<div
					className="flex flex-col gap-6 justify-center items-center"
					id="about"
				>
					<div className="rounded-full p-3 px-6 border border-primaryBlue text-primaryBlue bg-white">
						About us
					</div>
					<div className="flex justify-between items-center gap-28 p-8 px-16">
						<img src={bridging} className="w-full" />
						<div className="flex flex-col gap-3">
							<h3 className="text-3xl text-left font-trap-grotesk font-semibold">
								Bridging the gap
							</h3>
							<p className="text-lg text-left font-trap-grotesk">
								At Edture, we believe that education should keep pace
								with innovation. Our mission is to empower educators and
								learners with the skills and knowledge needed to
								effectively integrate emerging technologies into their
								teaching and learning practices. We bridge the digital
								divide by providing a web-based platform that offers
								up-to-date educational resources, courses, and ongoing
								support.
							</p>
						</div>
					</div>

					<div className="flex justify-between items-center gap-28 p-8 px-16 flex-row-reverse">
						<img src={community} className="w-full" />
						<div className="flex flex-col gap-3">
							<h3 className="text-3xl text-left font-trap-grotesk font-semibold">
								Fostering community
							</h3>
							<p className="text-lg text-left font-trap-grotesk">
								We are big on community. That's why we're dedicated to
								fostering a vibrant, inclusive, and supportive ecosystem
								where educators and learners can connect, collaborate,
								and grow together. By providing a shared space for
								knowledge-sharing, idea exchange, and mutual support, we
								aim to break down silos and create a collective momentum
								that drives innovation and excellence in education. Join
								us in building a community that elevates the art of
								teaching and learning for all.
							</p>
						</div>
					</div>
				</div>

				{/* COURSES */}
				<div className="flex flex-col gap-6">
					{allCoursesLoading && <SpinnerLoader />}
					<div className="flex justify-between items-center">
						<h3 className="text-3xl text-left font-trap-grotesk font-semibold">
							Courses to scale your knowledge
						</h3>
						<SecondaryButton
							text={"More courses"}
							onClick={goToCourses}
						/>
					</div>
					<div>
						<CourseCarousel>
							{allCourses?.courses?.map((course, index) => (
								<CourseCard key={index} course={course} />
							))}
						</CourseCarousel>
					</div>
				</div>
			</div>
			<CourseFooter />
		</div>
	);
};

export default Home;
