import {
	IconButton,
	Modal,
	useDisclosure,
	useToast,
	Button,
	Input,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	FormControl,
	Box,
} from "@chakra-ui/react";
import { useChat } from "../../../context/chatContext";
import { FiEdit } from "react-icons/fi";
import { useState } from "react";
import UserBadgeItem from "../userbadgeitem/UserBadgeItem";
import { useAuth } from "../../../context/authContext";
import UserListItem from "./../../userlists/UserListItem";
import {
	AddUserToGroupAPI,
	RemoveUserFromGroupAPI,
	RenameGroupChatAPI,
	SearchUserAPI,
} from "../../../backend-services/userApi";

const GroupCRUDModal = ({ fetchAllMessages }) => {
	const { fetchAgain, setFetchAgain, selectedChat, setSelectedChat } =
		useChat();
	const [auth] = useAuth();
	const [groupChatName, setGroupChatName] = useState("");
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState();
	const [loading, setLoading] = useState(false);
	const [renameLoading, setRenameLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const handleUserGroup = async (userToAdd) => {
		if (
			selectedChat.users.find(
				(existingUser) => existingUser._id === userToAdd._id
			)
		) {
			toast({
				title: "User Already in group!",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		if (selectedChat.groupAdmin._id !== auth.user.id) {
			toast({
				title: "Only Admin can add someone!",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		try {
			setLoading(true);
			const data = await AddUserToGroupAPI({
				chatId: selectedChat._id,
				userId: userToAdd._id,
			});
			if (data.status === "Success") {
				setFetchAgain(!fetchAgain);
				setSelectedChat(data.groupAfterUserAdding);
			}
		} catch (error) {
			console.log(error.message);
			toast({
				title: "Error when adding user!",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveUser = async (userToRemove) => {
		if (
			selectedChat.groupAdmin._id !== auth.user._id &&
			userToRemove._id !== auth.user._id
		) {
			toast({
				title: "Only admins can remove someone!",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}
		try {
			setLoading(true);
			const data = await RemoveUserFromGroupAPI({
				chatId: selectedChat._id,
				userId: userToRemove._id,
			});
			if (data.status === "Success") {
				userToRemove._id === auth.user._id
					? setSelectedChat("") && onClose()
					: setSelectedChat(data.groupAfterRemovingUser);
				setFetchAgain(!fetchAgain);
				fetchAllMessages();
			}
		} catch (error) {
			console.log(error.message);
			toast({
				title: "Error occured when removing user!",
				description: error.response.data.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleRename = async () => {
		if (!groupChatName) return;
		try {
			setRenameLoading(true);
			const data = await RenameGroupChatAPI({
				chatName: groupChatName,
				chatId: selectedChat._id,
			});
			if (data.status === "Success") {
				setFetchAgain(!fetchAgain);
				setSelectedChat(data.updatedChat);
			}
		} catch (error) {
			console.log(error.message);
			toast({
				title: "Error when updating!",
				description: error.response.data.message,
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		} finally {
			setRenameLoading(false);
			setGroupChatName("");
		}
	};

	const handleSearch = async (searchQuery) => {
		setSearch(searchQuery);
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
				position: "bottom",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<IconButton
				variant="outline"
				display={{ base: "flex" }}
				icon={<FiEdit style={{ color: "#4844CA" }} />}
				onClick={onOpen}
			/>

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize="2rem"
						display="flex"
						justifyContent="center">
						{selectedChat.chatName}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display="flex"
						flexDir="column"
						alignItems="center">
						{/* Showing user named badges */}
						<Box w="100%" d="flex" flexWrap="wrap" pb={3}>
							{selectedChat.users.map((user) => (
								<UserBadgeItem
									key={user._Id}
									user={user}
									handleUserFunction={() =>
										handleRemoveUser(user)
									}
								/>
							))}
						</Box>

						{/*Two form controlls inside a modal */}
						<FormControl display="flex">
							<Input
								placeholder="Chat Name"
								type="text"
								mb={3}
								onChange={(e) =>
									setGroupChatName(e.target.value)
								}
							/>
							<Button
								variant="solid"
								backgroundColor="#5650e8"
								color="white"
								_hover={{
									backgroundColor: "#5650e8",
								}}
								ml={1}
								isLoading={renameLoading}
								loadingText="Updating"
								onClick={handleRename}>
								Update
							</Button>
						</FormControl>

						<FormControl>
							<Input
								placeholder="Add Users eg: Shahriar, John"
								type="text"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>

						{/* Showing search reasults inside modal only 4 will show */}
						{loading ? (
							<div>Loading...</div>
						) : (
							searchResult
								?.slice(0, 4)
								.map((user) => (
									<UserListItem
										key={user._id}
										user={user}
										handleUserFunction={() =>
											handleUserGroup(user)
										}
									/>
								))
						)}
					</ModalBody>

					<ModalFooter>
						<Button
							onClick={() => handleRemoveUser(auth.user)}
							colorScheme="red">
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupCRUDModal;
