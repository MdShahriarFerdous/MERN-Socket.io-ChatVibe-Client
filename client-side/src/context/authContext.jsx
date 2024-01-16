import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({
		user: null,
		image: "",
		token: "",
	});

	axios.defaults.baseURL =
		import.meta.env.VITE_API || "http://localhost:3000/api/v1 ";
	axios.defaults.headers.common["Authorization"] = auth?.token;

	useEffect(() => {
		const data = localStorage.getItem("auth");
		if (data) {
			const parsedData = JSON.parse(data);
			setAuth({
				...auth,
				token: parsedData,
			});
		}
	}, []);

	useEffect(() => {
		const fetchUserData = async () => {
			if (auth?.token) {
				const { data } = await axios.get("/user-data");
				data.error
					? console.error(data.error)
					: setAuth({
							...auth,
							user: data.user,
							image: data.image,
					  });
			}
		};
		fetchUserData();
	}, [auth?.token]);

	return (
		<AuthContext.Provider value={[auth, setAuth]}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	return useContext(AuthContext);
};

export { useAuth, AuthProvider };
