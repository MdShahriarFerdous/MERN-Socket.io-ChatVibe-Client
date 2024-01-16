import { createContext, useContext, useState } from "react";
import FullScreenLoader from "../components/screenloader/ScreenLoader";

const LoaderContext = createContext();

const LoaderProvider = ({ children }) => {
	// Add loader state and functions to show/hide the loader
	const [loader, setLoader] = useState(false);

	return (
		<LoaderContext.Provider value={[loader, setLoader]}>
			{loader && <FullScreenLoader />}
			{children}
		</LoaderContext.Provider>
	);
};

const useLoader = () => {
	return useContext(LoaderContext);
};
export { useLoader, LoaderProvider };
