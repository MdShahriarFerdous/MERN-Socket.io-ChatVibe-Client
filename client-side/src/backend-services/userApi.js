import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//* =========================Register API=========================
export const RegisterAPI = async (values) => {
	let postBody = {
		...values,
	};
	try {
		const { data } = await axios.post("/user-register", postBody);
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Registration failed. Try again.");
	}
};

//* =========================Login API=========================
export const LoginAPI = async (values) => {
	let postBody = {
		...values,
	};
	try {
		const { data } = await axios.post("/user-login", postBody);
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Login failed. Try again.");
	}
};

//* =========================Search-User API=========================
export const SearchUserAPI = async (search) => {
	try {
		const { data } = await axios.get(`/search-user/${search}`);
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Search data fetching failed.");
	}
};

//* =========================Create-One-to-One-Chat API=========================
export const CreateSingleChatAPI = async (userId) => {
	try {
		const { data } = await axios.post("/one-to-one/chat-create", {
			userId,
		});
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Chat creating failed!.");
	}
};

//* =========================Fetch-User's-Chat API=========================
export const FetchUserChatAPI = async () => {
	try {
		const { data } = await axios.get("/fetch-user-chat");
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Chat creating failed!.");
	}
};

//* =========================Fetch-User's-Chat API=========================
export const CreateGroupChatAPI = async ({ name, users }) => {
	try {
		const { data } = await axios.post("/create-group-chat", {
			name,
			users,
		});
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Group Chat creating failed!.");
	}
};

//* =========================Rename-Group-Chat API=========================
export const RenameGroupChatAPI = async ({ chatName, chatId }) => {
	try {
		const { data } = await axios.put("/rename-group", {
			chatName,
			chatId,
		});
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Group Chat renaming failed!.");
	}
};

//* =========================Add-User-ToGroup API=========================
export const AddUserToGroupAPI = async ({ chatId, userId }) => {
	try {
		const { data } = await axios.put("/add-to-group", {
			chatId,
			userId,
		});
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Adding user to group failed!.");
	}
};

//* =========================Remove-User-FromGroup API=========================
export const RemoveUserFromGroupAPI = async ({ chatId, userId }) => {
	try {
		const { data } = await axios.put("/remove-from-group", {
			chatId,
			userId,
		});
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Removing user from group failed!.");
	}
};

//* =========================Send-Message API=========================
export const SendMessageAPI = async ({ content, chatId }) => {
	try {
		const { data } = await axios.post("/send-message", {
			content,
			chatId,
		});
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Send Message failed!.");
	}
};

//* =========================Fetch-All-Messages API=========================
export const FetchAllMessagesAPI = async (chatId) => {
	try {
		const { data } = await axios.get(`/get-all-messages/${chatId}`);
		if (data.error) {
			toast.error(data.error);
		} else {
			return data;
		}
	} catch (error) {
		console.error(error);
		toast.error("Messages fetching failed!");
	}
};
