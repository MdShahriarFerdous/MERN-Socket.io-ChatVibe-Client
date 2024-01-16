import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserRegister from "./components/authComponent/UserRegister";
import { useLoader } from "./context/loaderContext";
import PrivateRoute from "./routes/PrivateRoute";
import ChatPage from "./pages/ChatPage";
import "./App.css";

const RenderAppContent = () => {
	const [loader] = useLoader();
	if (loader) {
		return null;
	}
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/register" element={<UserRegister />} />

				<Route path="/user" element={<PrivateRoute />}>
					<Route path="chat" element={<ChatPage />} />
				</Route>
			</Routes>
			<ToastContainer
				autoClose={3000}
				draggable={false}
				position="top-right"
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnHover
			/>
		</BrowserRouter>
	);
};
const App = () => {
	return (
		<div className="App">
			<RenderAppContent />
		</div>
	);
};

export default App;
