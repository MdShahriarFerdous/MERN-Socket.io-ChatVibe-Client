import { Skeleton, Stack } from "@chakra-ui/react";

const ChatLoading = () => {
	return (
		<Stack>
			<Skeleton height="48px" />
			<Skeleton height="48px" />
			<Skeleton height="48px" />
			<Skeleton height="48px" />
			<Skeleton height="48px" />
			<Skeleton height="48px" />
		</Stack>
	);
};

export default ChatLoading;
