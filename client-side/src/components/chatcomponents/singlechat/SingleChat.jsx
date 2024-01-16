import { useEffect, useState, useRef } from "react";
import { useChat } from "../../../context/chatContext";
import { useAuth } from "../../../context/authContext";
import { IoSend } from "react-icons/io5";
import Lottie from "react-lottie";
import animationData from "../../../assets/animation/typing.json";
import {
	Avatar,
	Box,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
	getSender,
	getSenderFullObj,
	getSenderId,
	getSenderImage,
} from "../../../config/chatLogics";
import ProfileModal from "../profilemodal/ProfileModal";
import GroupCRUDModal from "../groupCRUDmodal/GroupCRUDModal";
import {
	FetchAllMessagesAPI,
	SendMessageAPI,
} from "../../../backend-services/userApi";
import "../styles.css";
import ChatLists from "./chatlists/ChatLists";
import { io } from "socket.io-client";

const ENDPOINT = "https://chatdive-realtime-chatapp.onrender.com";
let socket = io(ENDPOINT);
let selectedChatCompare;

const SingleChat = () => {
	const {
		fetchAgain,
		setFetchAgain,
		selectedChat,
		setSelectedChat,
		notification,
		setNotification,
		onlineUsers,
		setOnlineUsers,
	} = useChat();
	const [auth] = useAuth();
	const scrollRef = useRef();
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [socketConnected, setSocketConnected] = useState(false);
	const [socketArrivalMessage, setSocketArrivalMessage] = useState({});
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const toast = useToast();

	useEffect(() => {
		socket.emit("setup", auth.user);
		socket.on("connected", () => setSocketConnected(true));
		socket.on("message received", (newMessageReceived) => {
			if (Object.keys(newMessageReceived).length > 0) {
				setSocketArrivalMessage(newMessageReceived);
			} else {
				console.log("Received an empty message.");
			}
		});
		socket.on("typing", () => setIsTyping(true));
		socket.on("stop typing", () => setIsTyping(false));
		socket.emit("new-user-add", auth?.user?._id);
		socket.on("get-users", (activeUsers) => {
			setOnlineUsers(activeUsers);
		});
	}, []);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [isTyping]);

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
	};

	const fetchAllMessages = async () => {
		if (!selectedChat) return;
		try {
			setLoading(true);
			const data = await FetchAllMessagesAPI(selectedChat._id);
			if (data.status === "Success") {
				setMessages(data.allMessages);
				socket.emit("join chat", selectedChat._id);
			} else {
				console.log("Something wrong when fetching messages!");
			}
		} catch (error) {
			console.log(error.message);
			toast({
				title: "Error Occured!",
				description: "Failed to fetch Messages",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllMessages();
		selectedChatCompare = selectedChat;
	}, [selectedChat]);

	useEffect(() => {
		if (
			!selectedChatCompare ||
			selectedChatCompare._id !== socketArrivalMessage?.chat?._id
		) {
			if (
				Object.keys(socketArrivalMessage).length > 0 &&
				!notification.includes(socketArrivalMessage)
			) {
				setNotification([...notification, socketArrivalMessage]);
				setFetchAgain(!fetchAgain);
			}
		} else {
			setMessages([...messages, socketArrivalMessage]);
		}
	}, [socketArrivalMessage]);

	const sendMessage = async (event) => {
		if (event.key === "Enter" && newMessage) {
			let user = auth?.user;
			socket.emit("stop typing", { selectedChat, user });
			try {
				setNewMessage("");
				const data = await SendMessageAPI({
					content: newMessage,
					chatId: selectedChat._id,
				});
				if (data.status === "Success") {
					socket.emit("new message", data.newMessage);
					setMessages([...messages, data.newMessage]);
				}
			} catch (error) {
				toast({
					title: "Error Occured!",
					description: "Failed to send the Message",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "bottom",
				});
			}
		}
	};

	const sendMessageByIcon = async () => {
		let user = auth?.user;
		socket.emit("stop typing", { selectedChat, user });
		if (newMessage) {
			try {
				setNewMessage("");
				const data = await SendMessageAPI({
					content: newMessage,
					chatId: selectedChat._id,
				});
				if (data.status === "Success") {
					socket.emit("new message", data.newMessage);
					setMessages([...messages, data.newMessage]);
				}
			} catch (error) {
				toast({
					title: "Error Occured!",
					description: "Failed to send the Message",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "bottom",
				});
			}
		}
	};

	const typingHandler = async (e) => {
		setNewMessage(e.target.value);
		if (!socketConnected) return true;
		//typing = false; so !typing = true, if(condition always runs on true)
		//or you can say if typing === false
		let user = auth?.user;
		if (!typing) {
			setTyping(true);
			socket.emit("typing", { selectedChat, user });
		}
		/**
		 * Now, I want that, after ending the typing, an existing setTimeout
		 * function inside this typingHandler function will run after 3 sec.
		 * lastTypingTime variable will hold the time after finishing typing,
		 * because on every input word changing this function is running and the
		 * time will also changing so, last time change will also be assigned!
		 */
		const lastTypingTime = new Date().getTime();
		let timerLength = 3000;
		//after 3 sec of changing the input value this function will run
		setTimeout(() => {
			const timeNow = new Date().getTime();
			const timeDiff = timeNow - lastTypingTime; //always greater
			if (timeDiff >= timerLength && typing) {
				//typing is true here
				socket.emit("stop typing", { selectedChat, user });
				setTyping(false);
			}
		}, timerLength);
	};

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "1.3rem", md: "1.5rem" }}
						fontWeight="600"
						pb={3}
						px={2}
						w="100%"
						display="flex"
						justifyContent={{ base: "space-between" }}
						alignItems="center">
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>
						{!selectedChat?.isGroupChat ? (
							<>
								<Box
									display={{
										base: selectedChat ? "none" : "flex",
										md: "flex",
									}}
									pl={1}>
									<Avatar
										mr={2}
										boxSize="2.375rem"
										shadow="md"
										name={getSender(
											auth.user,
											selectedChat?.users
										)}
										src={getSenderImage(
											auth.user,
											selectedChat?.users
										)}
									/>
									{selectedChat &&
										!selectedChat.isGroupChat && (
											<p
												style={{
													fontSize: "0.875rem",
													marginTop: "12px",
												}}>
												{onlineUsers.some(
													(user) =>
														user.userId ===
														getSenderId(
															auth.user,
															selectedChat.users
														)
												)
													? "Online"
													: "Offline"}
											</p>
										)}
								</Box>

								{getSender(auth.user, selectedChat?.users)}
								<ProfileModal
									chatUser={getSenderFullObj(
										auth.user,
										selectedChat?.users
									)}
								/>
							</>
						) : (
							<>
								{selectedChat?.chatName}
								<GroupCRUDModal
									fetchAllMessages={fetchAllMessages}
								/>
							</>
						)}
					</Text>

					<Box
						d="flex"
						flexDir="column"
						justifyContent="flex-end"
						p={3}
						bg="#F9F9FC"
						w="100%"
						h="90%"
						borderRadius="lg"
						overflowY="scroll">
						{loading ? (
							<Box display="flex" w="100%" h="88%">
								<Spinner
									size="lg"
									w={20}
									h={20}
									alignSelf="center"
									margin="auto"
									thickness="4px"
									speed="0.65s"
									emptyColor="gray.200"
									color="#5650E8"
								/>
							</Box>
						) : (
							<div className="messages">
								<ChatLists messages={messages} />
							</div>
						)}
						{isTyping ? (
							<div className="mb-4" ref={scrollRef}>
								<Lottie
									options={defaultOptions}
									width={70}
									style={{ marginBottom: 15, marginLeft: 0 }}
								/>
							</div>
						) : (
							<></>
						)}
					</Box>
					<FormControl
						onKeyDown={sendMessage}
						isRequired
						mt={4}
						display="flex">
						<Input
							variant="filled"
							focusBorderColor="#5650e8"
							mr="12px"
							bg="#F1F1F8"
							placeholder="Enter a message.."
							_placeholder={{
								opacity: 0.7,
								color: "#30343f",
								fontSize: "1rem",
							}}
							value={newMessage}
							onChange={typingHandler}
							size="lg"
						/>
						<IconButton
							size="lg"
							h="46px"
							variant="outline"
							colorScheme="blue"
							pr="4px"
							onClick={sendMessageByIcon}
							icon={
								<IoSend
									style={{
										color: "#5650e8",
										fontSize: "1.6rem",
										marginLeft: "3px",
									}}
								/>
							}
						/>
					</FormControl>
				</>
			) : (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					h="100%">
					<Text fontSize="2xl" pb={3}>
						Click on a chat to start chatting
					</Text>
				</Box>
			)}
		</>
	);
};

export default SingleChat;
