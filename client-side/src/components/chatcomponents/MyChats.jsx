import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { AddIcon, ChatIcon } from "@chakra-ui/icons";
import { FetchUserChatAPI } from "../../backend-services/userApi";
import { useChat } from "../../context/chatContext";
import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import ChatLoading from "./chatloading/ChatLoading";
import {
	getSender,
	getSenderId,
	getSenderImage,
	truncateString,
} from "../../config/chatLogics";
import GroupChatModal from "./groupchatmodal/GroupChatModal";
import "./styles.css";

const MyChats = () => {
	const toast = useToast();
	const {
		selectedChat,
		setSelectedChat,
		chatDetails,
		setChatDetails,
		fetchAgain,
		onlineUsers,
	} = useChat();
	const [auth, setAuth] = useAuth();

	const fetchChats = async () => {
		try {
			const data = await FetchUserChatAPI();
			if (data.status === "Success") {
				setChatDetails(data.fetchedChat);
			}
		} catch (error) {
			console.log(error.message);
			toast({
				title: "Error fetching my chats",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	useEffect(() => {
		fetchChats();
	}, [fetchAgain]);

	return (
		<>
			<Box
				display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
				flexDir="column"
				alignItems="center"
				p={3}
				bg="white"
				w={{ base: "100%", md: "31%" }}
				borderRadius="lg"
				borderWidth="1px">
				<Box
					pb={3}
					px={3}
					fontSize={{ base: "1.3rem", md: "1.3rem" }}
					fontWeight="700"
					display="flex"
					w="100%"
					justifyContent="space-between"
					alignItems="center">
					My Chats
					<GroupChatModal>
						<Button
							d="flex"
							backgroundColor="#5650E8"
							color="white"
							fontSize={{
								base: "0.875rem",
								md: "10px",
								lg: "0.875rem",
							}}
							_hover={{
								backgroundColor: "#4844ca",
								color: "white",
							}}
							rightIcon={<AddIcon />}>
							New Group Chat
						</Button>
					</GroupChatModal>
				</Box>

				<Box
					display="flex"
					flexDir="column"
					p={3}
					bg="#F9F9FC"
					w="100%"
					h="100%"
					borderRadius="lg"
					overflowY="hidden">
					{chatDetails ? (
						<Stack overflowY="scroll">
							{chatDetails &&
								chatDetails?.map((chat) => (
									<Box
										onClick={() => setSelectedChat(chat)}
										cursor="pointer"
										display="flex"
										shadow="sm"
										mb="4px"
										bg={
											selectedChat === chat
												? "#BFD5D9"
												: "#F1F1F8"
										}
										px={3}
										py={3}
										borderRadius="lg"
										key={chat._id}>
										<div className="d-flex">
											{!chat.isGroupChat ? (
												<Avatar
													name={getSender(
														auth.user,
														chat?.users
													)}
													size="sm"
													src={getSenderImage(
														auth.user,
														chat.users
													)}
												/>
											) : (
												<Avatar
													name={chat.chatName}
													src=""
													size="sm"
												/>
											)}
											{chat && !chat.isGroupChat && (
												<div
													className="indicator"
													style={{
														background:
															onlineUsers.some(
																(user) =>
																	user.userId ===
																	getSenderId(
																		auth.user,
																		chat.users
																	)
															)
																? "#00FF00"
																: "",
													}}></div>
											)}
										</div>
										<div
											style={{
												width: "230px",
												padding: "0",
											}}>
											<Text
												color={
													selectedChat === chat
														? "black"
														: "#30343f"
												}
												fontSize="0.9rem"
												ml={
													!chat?.isGroupChat
														? "1"
														: "3"
												}
												mb={1}
												fontWeight="500">
												{!chat?.isGroupChat
													? getSender(
															auth.user,
															chat?.users
													  )
													: chat.chatName}
											</Text>
											{chat.latestMessage && (
												<Text
													fontSize="xs"
													p={0}
													m={0}
													ml={
														!chat?.isGroupChat
															? "1"
															: "3"
													}
													mt="1px">
													<b>
														{
															chat.latestMessage
																.sender.name
														}{" "}
														:{" "}
													</b>
													{chat.latestMessage.content
														.length > 50
														? truncateString(
																chat
																	.latestMessage
																	.content,
																50
														  )
														: chat.latestMessage
																.content}
												</Text>
											)}
										</div>
									</Box>
								))}
						</Stack>
					) : (
						<ChatLoading />
					)}
				</Box>
			</Box>
		</>
	);
};

export default MyChats;
