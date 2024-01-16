import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import "../assets/css/bootstrap.css";
import { useAuth } from "../context/authContext";
import { Box } from "@chakra-ui/react";
import MyChats from "../components/chatcomponents/MyChats";
import ChatBox from "../components/chatcomponents/ChatBox";
import NavBar from "../components/chatcomponents/NavBar";

const ChatPage = () => {
	const [auth, setAuth] = useAuth();

	return (
		<div style={{ width: "100%" }}>
			{auth.user && <NavBar />}
			<Box
				display="flex"
				justifyContent="space-between"
				w="100%"
				h="91.5vh"
				p="12px">
				{auth.user && <MyChats />}
				{auth.user && <ChatBox />}
			</Box>
		</div>
	);
};

export default ChatPage;
