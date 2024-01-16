import { Box, Text } from "@chakra-ui/react";
import { useChat } from "../../context/chatContext";
import SingleChat from "./singlechat/SingleChat";

const ChatBox = () => {
	const { selectedChat } = useChat();
	return (
		<Box
			display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
			alignItems="center"
			flexDir="column"
			p={3}
			bg="white"
			w={{ base: "100%", md: "68%" }}
			borderRadius="lg"
			borderWidth="1px">
			<SingleChat />
		</Box>
	);
};

export default ChatBox;
