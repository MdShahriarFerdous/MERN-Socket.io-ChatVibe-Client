import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import "../../assets/css/bootstrap.css";
import "./auth.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { object, string } from "yup";
import { LoginAPI } from "../../backend-services/userApi";
import { useAuth } from "../../context/authContext";
import { useLoader } from "../../context/loaderContext";
import { IoChatbubbles } from "react-icons/io5";

const UserLogin = () => {
	const [auth, setAuth] = useAuth();
	const [loader, setLoader] = useLoader();
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: object({
			email: string().email("Must be valid email").required(),
			password: string().min(6, "Minimum 6 characters long").required(),
		}),
		onSubmit: async (values, { resetForm }) => {
			setLoader(true);
			try {
				const data = await LoginAPI(values);
				if (data?.status === "Success") {
					localStorage.setItem("auth", JSON.stringify(data.token));

					setAuth({
						...auth,
						user: data.user,
						image: data.image,
						token: data.token,
					});
					resetForm({
						values: "",
					});
					toast.success("Login successful");
					navigate("/user/chat");
				}
			} catch (error) {
				console.error(error);
				toast.error(error.response.data.error.message);
			} finally {
				setLoader(false);
			}
		},
	});
	return (
		<div className="container p-5">
			<div className="container text-center d-flex align-items-center justify-content-center">
				<IoChatbubbles className="chat-icon" />
				<h1 className="logo-name">ChatVibe</h1>
			</div>

			<form className="form-group p-4" onSubmit={formik.handleSubmit}>
				<div className="row d-flex py-4 justify-content-center">
					<div className="col-lg-6">
						<div className="card p-5 auth-form-card">
							<h2 className="card-title mb-4 text-center">
								Log in
							</h2>
							<input
								type="email"
								className="form-control my-2 py-3 email-input"
								placeholder="Email"
								name="email"
								value={formik.values.email}
								onChange={formik.handleChange}
							/>
							{formik.touched.email && formik.errors.email && (
								<span className="text-danger my-1 ms-2">
									&#9432; {formik.errors.email}
								</span>
							)}
							<input
								type="password"
								className="form-control my-2 py-3 password-input"
								placeholder="Password (minimum 6 characters long)"
								name="password"
								value={formik.values.password}
								onChange={formik.handleChange}
							/>
							{formik.touched.password &&
								formik.errors.password && (
									<span className="text-danger my-1 ms-2">
										&#9432; {formik.errors.password}
									</span>
								)}
							<button
								type="submit"
								className="btn bg-gradient-primary my-2 submit-btn">
								LOGIN
							</button>
							<p className="text-center mt-2">
								New Here?
								<NavLink
									className="text-info ms-2"
									to="/register">
									Register
								</NavLink>
							</p>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default UserLogin;
