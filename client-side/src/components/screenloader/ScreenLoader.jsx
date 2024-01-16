import loader from "../../assets/loader/chat-loader.svg";
import "./loader.css";

const ScreenLoader = () => {
	return (
		<div>
			<div className="ProcessingDiv">
				<div className="center-screen">
					<img src={loader} className="loader-size" />
				</div>
			</div>
		</div>
	);
};

export default ScreenLoader;
