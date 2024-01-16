import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	FormControl,
	useToast,
	Box,
} from "@chakra-ui/react";
import {
	CreateGroupChatAPI,
	SearchUserAPI,
} from "../../../backend-services/userApi";
import { useState } from "react";
import UserListItem from "./../../userlists/UserListItem";
import UserBadgeItem from "../userbadgeitem/UserBadgeItem";
import { useChat } from "../../../context/chatContext";

const GroupChatModal = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState("");
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const { chatDetails, setChatDetails } = useChat();
	const toast = useToast();

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
				position: "bottom-left",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async () => {
		if (!groupChatName || !selectedUsers) {
			toast({
				title: "Please fill all the fields",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
			return;
		}
		try {
			const data = await CreateGroupChatAPI({
				name: groupChatName,
				users: JSON.stringify(selectedUsers.map((user) => user._id)),
			});
			setChatDetails([data.fullGroupChat, ...chatDetails]);
			onClose();
			toast({
				title: "New Group Chat Created!",
				status: "success",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
		} catch (error) {
			console.log(error.message);
			toast({
				title: "Error occured!",
				description: "Failed to load search results",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
		}
	};

	const handleUserGroup = (userToAdd) => {
		if (selectedUsers.includes(userToAdd)) {
			toast({
				title: "User already added!",
				status: "warning",
				duration: 2000,
				isClosable: true,
				position: "top",
			});
			return;
		} else {
			setSelectedUsers([...selectedUsers, userToAdd]);
		}
	};

	const handleRemoveUser = (userToRemove) => {
		const arrayAfterRemovingUser = selectedUsers.filter(
			(user) => user._id !== userToRemove._id
		);
		setSelectedUsers(arrayAfterRemovingUser);
	};

	return (
		<>
			{children && <span onClick={onOpen}>{children}</span>}

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize={{ base: "1.4rem", md: "1.678rem" }}
						display="flex"
						justifyContent="center">
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display="flex"
						flexDir="column"
						alignItems="center">
						{/*Two form controlls inside a modal */}
						<FormControl>
							<Input
								placeholder="Chat Name"
								type="text"
								mb={3}
								onChange={(e) =>
									setGroupChatName(e.target.value)
								}
							/>
						</FormControl>

						<FormControl>
							<Input
								placeholder="Add Users eg: Shahriar, John"
								type="text"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>

						{/* After selecting users inside selectedUser array*/}
						<Box w="100%" display="flex" flexWrap="wrap">
							{selectedUsers &&
								selectedUsers.map((user) => (
									<UserBadgeItem
										key={user._Id}
										user={user}
										handleUserFunction={() =>
											handleRemoveUser(user)
										}
									/>
								))}
						</Box>
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
							backgroundColor="#5650E8"
							color="white"
							_hover={{
								backgroundColor: "#4844ca",
								color: "white",
							}}
							onClick={handleSubmit}>
							Create Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModal;
