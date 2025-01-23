import axios from "axios";
import TokenService from "./token.service";
import AuthService from "./auth.service";

const api = axios.create({
  baseURL: "https://food-delivery-be-xk4s.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm access token vào request headers
api.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi 401 và làm mới token nếu hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu lỗi là 401 và chưa thử lại
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await AuthService.refreshToken(); // Gọi API refresh token
        const newAccessToken = data.accessToken;

        TokenService.setUser(newAccessToken); // Lưu token mới vào localStorage
        originalRequest.headers["x-access-token"] = newAccessToken; // Cập nhật header

        return api(originalRequest); // Gửi lại request gốc
      } catch (err) {
        console.error("Failed to refresh token:", err);
        AuthService.logout(); // Đăng xuất nếu refresh token thất bại
        window.location.href = "/login"; // Chuyển hướng về trang đăng nhập
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
