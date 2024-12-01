import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../Redux/apiRequest";
import { axiosCreate } from "../../axios/createInstance";
import { logoutSuccess } from "../Redux/authSlice";
const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  console.log("check user ", user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accesstoken = useSelector(
    (state) => state?.auth?.login?.currentUser?.accessToken
  );
  let axiosJWT = axiosCreate(user, accesstoken, dispatch, logoutSuccess);
  const Logout = () => {
    logoutUser(dispatch, accesstoken, navigate, axiosJWT);
  };
  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-home">
        {" "}
        Home{" "}
      </Link>
      {user ? (
        <>
          <p className="navbar-user">
            Hi, <span> {user?.userInfo?.username || user?.username}</span>{" "}
          </p>
          <Link to="/login" className="navbar-logout" onClick={Logout}>
            {" "}
            Log out
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-login">
            {" "}
            Login{" "}
          </Link>
          <Link to="/register" className="navbar-register">
            {" "}
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
