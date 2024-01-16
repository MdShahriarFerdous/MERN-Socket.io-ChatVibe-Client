import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
	const [selectedChat, setSelectedChat] = useState();
	const [chatDetails, setChatDetails] = useState([]);
	const [fetchAgain, setFetchAgain] = useState(false);
	const [notification, setNotification] = useState([]);
	const [onlineUsers, setOnlineUsers] = useState([]);

	return (
		<ChatContext.Provider
			value={{
				selectedChat,
				setSelectedChat,
				chatDetails,
				setChatDetails,
				fetchAgain,
				setFetchAgain,
				notification,
				setNotification,
				onlineUsers,
				setOnlineUsers,
			}}>
			{children}
		</ChatContext.Provider>
	);
};

const useChat = () => {
	return useContext(ChatContext);
};

export { useChat, ChatProvider };
