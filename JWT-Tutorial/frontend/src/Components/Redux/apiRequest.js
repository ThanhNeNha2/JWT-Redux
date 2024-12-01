import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "./authSlice";
import {
  deleteUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  getUserFailed,
  getUserStart,
  getUserSuccess,
} from "./userSlice";
export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("http://localhost:8080/v1/auth/login", user, {
      withCredentials: true, // Đảm bảo gửi cookie đi cùng yêu cầu
    });
    dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (error) {
    dispatch(loginFailed());
  }
};

export const logoutUser = async (dispatch, accessToken, navigate, axiosJWT) => {
  dispatch(logoutStart());
  try {
    await axiosJWT.post(
      "http://localhost:8080/v1/auth/logout",
      {}, // Body của yêu cầu (ở đây không có payload)
      {
        headers: { token: "Bearer " + accessToken }, // Đưa headers vào đây
        withCredentials: true, // Gửi cookie cùng yêu cầu
      }
    );

    dispatch(logoutSuccess([]));
    navigate("/login");
  } catch (error) {
    console.error("Logout error:", error); // Log lỗi để dễ debug
    dispatch(logoutFailed());
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post("http://localhost:8080/v1/auth/register", user);
    dispatch(registerSuccess());
    navigate("/login");
  } catch (error) {
    dispatch(registerFailed());
  }
};

export const getAllUser = async (accesstoken, dispatch, axiosJWT) => {
  dispatch(getUserStart());
  try {
    const res = await axiosJWT.get("http://localhost:8080/v1/user", {
      headers: { token: `Bearer ${accesstoken}` },
    });
    dispatch(getUserSuccess(res.data.data));
  } catch (error) {
    dispatch(getUserFailed());
  }
};

export const deleteUser = async (accesstoken, id, dispatch, axiosJWT) => {
  dispatch(deleteUserStart());
  try {
    const res = await axiosJWT.delete(`http://localhost:8080/v1/user/${id}`, {
      headers: { token: `Bearer ${accesstoken}` },
    });
    dispatch(deleteUserSuccess(res.data));
  } catch (error) {
    console.log(error);
  }
};
