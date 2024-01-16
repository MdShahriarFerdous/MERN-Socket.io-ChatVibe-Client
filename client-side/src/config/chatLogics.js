export const getSender = (loggedUser, users) => {
	return users[0]?.name === loggedUser?.name
		? users[1]?.name
		: users[0]?.name;
};

export const getSenderId = (loggedUser, users) => {
	return users[0]?.name === loggedUser?.name ? users[1]?._id : users[0]?._id;
};

// export const getSender = (loggedUser, users) => {
// 	if (users && users.length >= 2) {
// 		return users[0]?.name === loggedUser?.name
// 			? users[1]?.name
// 			: users[0]?.name;
// 	}

// 	return "Unknown Sender";
// };

export const getSenderImage = (loggedUser, users) => {
	return users[0].name === loggedUser.name ? users[1].image : users[0].image;
};

export const getSenderFullObj = (loggedUser, users) => {
	return users[0].name === loggedUser.name ? users[1] : users[0];
};

//will return true or false
export const isSameSender = (messages, m, i, userId) => {
	return (
		i < messages.length - 1 &&
		(messages[i + 1].sender._id !== m.sender._id ||
			messages[i + 1].sender._id === undefined) &&
		messages[i].sender._id !== userId
	);
};

//will return true or false
export const isLastMessage = (messages, i, userId) => {
	return (
		i === messages.length - 1 &&
		messages[messages.length - 1].sender._id !== userId &&
		messages[messages.length - 1].sender._id
	);
};

export const isSameSenderMargin = (messages, m, i, userId) => {
	if (
		i < messages.length - 1 &&
		messages[i + 1].sender._id === m.sender._id &&
		messages[i].sender._id !== userId
	)
		return 33;
	else if (
		(i < messages.length - 1 &&
			messages[i + 1].sender._id !== m.sender._id &&
			messages[i].sender._id !== userId) ||
		(i === messages.length - 1 && messages[i].sender._id !== userId)
	)
		return 0;
	else return "auto";
};

export const isSameUser = (messages, m, i) => {
	return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const truncateString = (str, num) => {
	if (str.length > num) return str.slice(0, num) + " ... ";
	else return str;
};
