import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleUserFunction }) => {
	return (
		<Box
			onClick={handleUserFunction}
			mt={3}
			cursor="pointer"
			bg="#edf2f7"
			_hover={{
				background: "#93B7BE",
			}}
			w="100%"
			display="flex"
			alignItems="center"
			color="rgb(52, 71, 103)"
			px={3}
			py={2}
			borderRadius="lg">
			<Avatar
				mr={2}
				size="md"
				cursor="pointer"
				name={user?.name}
				src={user?.image}
			/>

			<Box w="100%">
				<Text mb="3px">{user.name}</Text>
				<Text fontSize="xs" mb="4px">
					<b>Email: </b>
					{user.email}
				</Text>
			</Box>
		</Box>
	);
};

export default UserListItem;
