import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { AuthProvider } from "./context/authContext.jsx";
import { LoaderProvider } from "./context/loaderContext.jsx";
import { ChakraProvider } from "@chakra-ui/react";

import "./index.css";
import { ChatProvider } from "./context/chatContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<LoaderProvider>
		<ChatProvider>
			<AuthProvider>
				<ChakraProvider>
					<App />
				</ChakraProvider>
			</AuthProvider>
		</ChatProvider>
	</LoaderProvider>
);
