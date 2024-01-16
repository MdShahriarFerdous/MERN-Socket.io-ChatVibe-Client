import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Loading from "../components/screenloader/CounterLoader";

const PrivateRoute = () => {
	const [hasToken, setHasToken] = useState(false);
	const [auth, setAuth] = useAuth();

	useEffect(() => {
		if (auth?.token) {
			setHasToken(true);
		} else {
			setHasToken(false);
		}
	}, [auth?.token]);
	return hasToken ? <Outlet /> : <Loading />;
};

export default PrivateRoute;
