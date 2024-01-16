import {
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Input,
	Button,
	Box,
	useToast,
	Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useChat } from "../../../context/chatContext";
import {
	CreateSingleChatAPI,
	SearchUserAPI,
} from "../../../backend-services/userApi";
import ChatLoading from "../chatloading/ChatLoading";
import UserListItem from "../../userlists/UserListItem";

const SideDrawer = ({ isOpen, onClose }) => {
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState();
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);
	const { selectedChat, setSelectedChat, chatDetails, setChatDetails } =
		useChat();

	const toast = useToast();

	const handleSearch = async () => {
		if (!search) {
			toast({
				title: "Please enter something for search",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}
		try {
			setLoading(true);
			if (search !== "") {
				const data = await SearchUserAPI(search);
				setSearchResult(data.searchResult);
			}
		} catch (error) {
			console.log(error.message);
			toast({
				title: "Error occured!",
				description: "Failed to load search results",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom-left",
			});
		} finally {
			setLoading(false);
		}
	};

	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);
			const data = await CreateSingleChatAPI(userId);

			if (!chatDetails.find((chat) => chat._id === data.fullChat._id)) {
				setChatDetails([data.fullChat, ...chatDetails]);
			}
			setSelectedChat(data.fullChat);
		} catch (error) {
			console.log(error.message);
			toast({
				title: "Error fetching chat",
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom-left",
			});
		} finally {
			setLoadingChat(false);
			onClose();
		}
	};

	return (
		<>
			<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth="1px">
						Search Users
					</DrawerHeader>

					<DrawerBody>
						<Box display="flex" pb={2}>
							<Input
								placeholder="Search by name or email..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								mr={2}
							/>
							<Button
								onClick={handleSearch}
								backgroundColor="#5650e8"
								color="white"
								_hover={{
									backgroundColor: "#4844CA",
								}}>
								Go
							</Button>
						</Box>

						{loading ? (
							<ChatLoading />
						) : (
							searchResult &&
							searchResult?.map((user) => (
								<UserListItem
									key={user._id}
									user={user}
									handleUserFunction={() =>
										accessChat(user._id)
									}
								/>
							))
						)}

						{loadingChat && (
							<Box
								display="flex"
								alignItems="center"
								justifyContent="center">
								<Spinner
									thickness="4px"
									emptyColor="gray.200"
									color="#5650e8"
									size="xl"
								/>
							</Box>
						)}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SideDrawer;
