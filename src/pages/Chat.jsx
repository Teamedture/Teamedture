import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import CourseDetailsLayout from "../layouts/CourseDetailsLayout";
import ChatUI from "../components/courses/ChatComponent";
import { userContext } from "../context/UserContext";

const Chat = () => {
	const { id } = useParams();

	const { allCourse, token } = useContext(userContext);
	return (
		<div>
			<CourseDetailsLayout>
				<ChatUI token={token} courseId={id}/>
			</CourseDetailsLayout>
		</div>
	);
};

export default Chat;
