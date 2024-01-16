import moment from "moment";
import { useAuth } from "../../../../context/authContext";
import {
	isLastMessage,
	isSameSender,
	isSameSenderMargin,
	isSameUser,
} from "../../../../config/chatLogics";
import { Avatar, Text, Tooltip } from "@chakra-ui/react";
import { useRef, useEffect } from "react";

const ChatLists = ({ messages }) => {
	const [auth] = useAuth();
	const scrollRef = useRef();
	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	return (
		<>
			{messages &&
				messages.map((m, i) => (
					<div
						style={{ display: "flex" }}
						key={m._id}
						ref={scrollRef}>
						{m.sender._id !== auth.user._id &&
							(isSameSender(messages, m, i, auth.user._id) ||
								isLastMessage(messages, i, auth.user._id)) && (
								<Tooltip
									label={m.sender.name}
									placement="bottom-start"
									hasArrow>
									<Avatar
										mt="7px"
										mr={1}
										size="sm"
										cursor="pointer"
										name={m.sender.name}
										src={m.sender.image}
									/>
								</Tooltip>
							)}

						<div
							style={{
								display: "flex",
								background: `${
									m.sender._id === auth.user._id
										? "#C5E0FB"
										: "#E8EBED"
								}`,
								borderRadius: "20px",
								padding: "8px 10px 8px 15px",
								maxWidth: "65%",
								marginLeft: isSameSenderMargin(
									messages,
									m,
									i,
									auth.user._id
								),
								marginTop: isSameUser(
									messages,
									m,
									i,
									auth.user._id
								)
									? 3
									: 10,
							}}>
							<span style={{ maxWidth: "80%" }}>{m.content}</span>
							<span
								style={{
									position: "relative",
									bottom: "-2px",
									paddingTop: "4px",
									marginTop: "4px",
									marginLeft: "12px",
									fontSize: "0.8rem",
									color: "#4b4b4b",
									// maxWidth: "56px",
								}}>
								{moment(m.createdAt).format("LT")}
							</span>
						</div>
					</div>
				))}
		</>
	);
};

export default ChatLists;
