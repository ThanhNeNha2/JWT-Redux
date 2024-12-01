import axios from "axios";
import { jwtDecode } from "jwt-decode";

const refreshToken = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8080/v1/auth/refresh",
      {},
      {
        withCredentials: true,
      }
    );
    return res.data; // Đảm bảo API trả về newToken trong res.data
  } catch (error) {
    console.log(error);
    throw error; // Ném lỗi để xử lý ở interceptor
  }
};

export const axiosCreate = (user, accessToken, dispatch, stateSuccess) => {
  let axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      try {
        const date = new Date();
        const expToken = jwtDecode(accessToken); // Đảm bảo accesstoken đã được định nghĩa
        if (expToken.exp < date.getTime() / 1000) {
          const res = await refreshToken(); // Thêm await
          const newToken = res.newToken; // Đảm bảo API trả về newToken
          console.log("check newToken", newToken);

          const refreshUser = {
            ...user?.userInfo,
            accessToken: newToken,
          };
          dispatch(stateSuccess(refreshUser)); // Cập nhật Redux state
          config.headers["token"] = "Bearer " + newToken; // Gán header mới
        }
        return config;
      } catch (error) {
        console.log("Interceptor Error:", error);
        return Promise.reject(error);
      }
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return axiosJWT;
};
