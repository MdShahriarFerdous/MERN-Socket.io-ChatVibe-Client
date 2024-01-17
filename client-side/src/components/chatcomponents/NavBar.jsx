import {
	Avatar,
	Box,
	Button,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
	Tooltip,
	useDisclosure,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";
import { IoChatbubbles } from "react-icons/io5";
import { BellIcon } from "@chakra-ui/icons";
import { useAuth } from "../../context/authContext";
import "./animate.min.css";
import "./styles.css";
import ProfileModal from "./profilemodal/ProfileModal";
import { useNavigate } from "react-router-dom";
import SideDrawer from "./sidedrawer/SideDrawer";
import { useChat } from "../../context/chatContext";
import { getSender, truncateString } from "../../config/chatLogics";

const NavBar = () => {
	const [auth, setAuth] = useAuth();
	const { notification, setNotification, selectedChat, setSelectedChat } =
		useChat();
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleLogout = () => {
		setAuth({ ...auth, user: null, image: "", token: "" });
		localStorage.removeItem("auth");
		navigate("/");
	};

	const handleNotifyClick = (notifyMsg, notification) => {
		setSelectedChat(notifyMsg.chat);
		setNotification(notification.filter((msg) => msg !== notifyMsg));
	};

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bg="white"
				w="100%"
				p="4px 4%"
				boxShadow="sm">
				<Tooltip
					label="search user to chat"
					hasArrow
					placement="bottom-end"
					p="2"
					bg="#242038">
					<Button
						variant="outline"
						onClick={onOpen}
						border="1px"
						borderColor="#5650E8">
						<IoSearch />
						<Text
							display={{ base: "none", md: "flex" }}
							justifyContent="center"
							alignItems="center"
							mt="4"
							mx="2">
							Search User to Chat
						</Text>
					</Button>
				</Tooltip>

				<div className="d-flex justify-content-center align-content-center pt-2">
					<Text
						mr={{ base: "0", md: "22px" }}
						ml={{ base: "24px" }}
						display="flex"
						fontSize={{ base: "1.58rem", md: "1.678rem" }}
						placement="right-end"
						fontFamily="Noto Sans"
						fontWeight="600"
						color="#5650e8"
						pt="6px">
						<IoChatbubbles className="chat-icon-navbar" />
						ChatVibe
					</Text>
				</div>

				<div className="p-2 d-flex align-items-center">
					<Menu>
						<MenuButton
							p={1}
							mr={{ base: "1.5rem", md: "3rem" }}
							mt="3px">
							{notification.length > 0 && (
								<div className="notify-div animated bounceInDown">
									<p
										style={{
											fontSize: "0.8rem",
											fontWeight: "bold",
											color: "white",
											marginBottom: "3px",
										}}>
										{notification.length}
									</p>
								</div>
							)}

							<BellIcon boxSize={7} color="#AFAFD5" />
						</MenuButton>

						<MenuList p={3}>
							{notification.length === 0 && "No New Messages"}
							{notification.length > 0 &&
								notification.map((notifyMsg) => (
									<MenuItem
										key={notifyMsg._id}
										onClick={() => {
											handleNotifyClick(
												notifyMsg,
												notification
											);
										}}>
										{notifyMsg.chat?.isGroupChat
											? `Message in ${truncateString(
													notifyMsg.chat?.chatName,
													14
											  )}`
											: `New Message from ${getSender(
													auth?.user,
													notifyMsg.chat?.users
											  )}`}
									</MenuItem>
								))}
						</MenuList>
					</Menu>

					<Menu>
						<MenuButton bg="white">
							<Avatar
								boxSize="2.3rem"
								name={auth ? auth?.user?.name : "Unknown"}
								cursor="pointer"
								src={auth?.image}
								mr="4px"
								shadow="md"
							/>
						</MenuButton>
						<MenuList p="4px">
							<ProfileModal auth={auth}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModal>
							<MenuDivider color="#e3e5e7" />
							<MenuItem onClick={handleLogout}>Logout</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>

			<SideDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
		</>
	);
};

export default NavBar;
