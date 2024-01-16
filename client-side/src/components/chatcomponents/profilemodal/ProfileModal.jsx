import { ViewIcon, InfoOutlineIcon, InfoIcon } from "@chakra-ui/icons";
import {
	Button,
	IconButton,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from "@chakra-ui/react";

const ProfileModal = ({ chatUser, auth, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			{children ? (
				<span onClick={onOpen}>{children}</span>
			) : (
				<IconButton
					display={{ base: "flex" }}
					variant="outline"
					fontSize="1.268rem"
					size="md"
					icon={<InfoIcon color="#5650e8" />}
					onClick={onOpen}
				/>
			)}

			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent h="410px">
					<ModalHeader
						fontSize={{ base: "2rem", md: "2.5rem" }}
						display="flex"
						justifyContent="center">
						{chatUser ? chatUser.name : auth?.user?.name}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display="flex"
						flexDir="column"
						alignItems="center"
						justifyContent="space-between">
						<Image
							borderRadius="full"
							boxSize="150px"
							src={chatUser ? chatUser.image : auth.image}
							alt={chatUser ? chatUser.name : auth.user.name}
						/>
						<Text fontSize={{ base: "28px", md: "30px" }}>
							Email: {chatUser ? chatUser.email : auth.user.email}
						</Text>
					</ModalBody>

					<ModalFooter>
						<Button bg="#e3e5e7" mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModal;
