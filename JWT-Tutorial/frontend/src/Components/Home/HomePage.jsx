import { useEffect, useState } from "react";
import "./home.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUser } from "../Redux/apiRequest";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../Redux/authSlice";
import { axiosCreate } from "../../axios/createInstance";
const HomePage = () => {
  const [userData, setuserData] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state?.auth?.login?.currentUser);
  const accesstoken = useSelector(
    (state) => state?.auth?.login?.currentUser?.accessToken
  );

  const role = useSelector(
    (state) => state?.auth?.login?.currentUser?.userInfo?.admin
  );

  // REFRESH TOKEN
  let axiosJWT = axiosCreate(user, accesstoken, dispatch, loginSuccess);

  // const refreshToken = async () => {
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:8080/v1/auth/refresh",
  //       {},
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     return res.data; // Đảm bảo API trả về newToken trong res.data
  //   } catch (error) {
  //     console.log(error);
  //     throw error; // Ném lỗi để xử lý ở interceptor
  //   }
  // };

  // axiosJWT.interceptors.request.use(
  //   async (config) => {
  //     try {
  //       const date = new Date();
  //       const expToken = jwtDecode(accesstoken); // Đảm bảo accesstoken đã được định nghĩa
  //       if (expToken.exp < date.getTime() / 1000) {
  //         const res = await refreshToken(); // Thêm await
  //         const newToken = res.newToken; // Đảm bảo API trả về newToken
  //         const refreshUser = {
  //           ...user?.userInfo,
  //           accessToken: newToken,
  //         };
  //         dispatch(loginSuccess(refreshUser)); // Cập nhật Redux state
  //         config.headers["token"] = "Bearer " + newToken; // Gán header mới
  //       }
  //       return config;
  //     } catch (error) {
  //       console.log("Interceptor Error:", error);
  //       return Promise.reject(error);
  //     }
  //   },
  //   (err) => {
  //     return Promise.reject(err);
  //   }
  // );

  const userCurrent = useSelector((state) => state?.users?.users?.currentUser);
  useEffect(() => {
    // Kiểm tra token, nếu không có thì chuyển hướng
    if (!accesstoken) {
      navigate("/login");
    } else {
      // Lấy tất cả user nếu có token
      getAllUser(accesstoken, dispatch, axiosJWT);
    }
    // const checkCookies = async () => {
    //   try {
    //     const response = await axios.get(
    //       "http://localhost:8080/v1/auth/check",
    //       {
    //         withCredentials: true,
    //       }
    //     );
    //     console.log(response.data); // Log kết quả server trả về
    //   } catch (error) {
    //     console.error("Error checking cookies:", error);
    //   }
    // };
    // checkCookies();
  }, [accesstoken, dispatch, navigate]);

  useEffect(() => {
    // Cập nhật userData khi userCurrent thay đổi
    if (userCurrent) {
      setuserData(userCurrent);
    } else {
      setuserData([]);
    }
  }, [userCurrent]);

  const handleDeleteUser = (id) => {
    console.log("hihi");

    deleteUser(accesstoken, id, dispatch, axiosJWT);
  };
  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div> Role of you {role === false ? " USER" : "ADMIN"}</div>

      <div className="home-userlist">
        {userData.map((user) => {
          return (
            <div className="user-container" key={user._id}>
              <div className="home-user">{user.username}</div>
              <div
                className="delete-user "
                onClick={() => {
                  handleDeleteUser(user._id);
                }}
              >
                {" "}
                Delete{" "}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default HomePage;
