import { Badge } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleUserFunction }) => {
	return (
		<Badge
			onClick={handleUserFunction}
			px={2}
			py={1}
			borderRadius="lg"
			m={1}
			mb={2}
			variant="solid"
			fontSize={12}
			colorScheme="purple"
			cursor="pointer">
			{user.name}
			<CloseIcon pl={1} pb={1} />
		</Badge>
	);
};

export default UserBadgeItem;
