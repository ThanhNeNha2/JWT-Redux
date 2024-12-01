import { useState } from "react";
import "./register.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "../Redux/apiRequest";
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  let handleRegister = (e) => {
    e.preventDefault();
    const user = {
      username,
      password,
      email,
    };
    registerUser(user, dispatch, navigate);
  };
  return (
    <section className="register-container">
      <div className="register-title"> Sign up </div>
      <form>
        <label>EMAIL</label>
        <input
          type="text"
          placeholder="Enter your email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <label>USERNAME</label>
        <input
          type="text"
          placeholder="Enter your username"
          name="username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <label>PASSWORD</label>
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="submit" onClick={handleRegister}>
          {" "}
          Create account{" "}
        </button>
      </form>
    </section>
  );
};
export default Register;
