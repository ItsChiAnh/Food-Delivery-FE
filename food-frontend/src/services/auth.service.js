import api from "./api";
import TokenService from "./token.service";

class AuthService {
  // Đăng ký
  async register(
    userName,
    email,
    password,
    avatar = "default-avatar.png",
    cartData = {}
  ) {
    return api.post("/auth/register", {
      userName,
      email,
      password,
      avatar,
      cartData,
    });
  }

  // Đăng nhập
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("Login Response:", response);

      if (response.data.tokens.access_token) {
        // Lưu access token và thông tin người dùng vào localStorage
        TokenService.setUser(response.data.tokens.access_token);
        console.log("access token stored: ", response.data.tokens.access_token);
        localStorage.setItem(
          "userInfo",
          JSON.stringify(response.data.userinfo)
        );
        const savedToken = localStorage.getItem("access_token");
        console.log("User Info and Token saved to localStorage");
        console.log("access Token from localStorage: ", savedToken);
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Đăng xuất
  logout() {
    // Xóa thông tin token và người dùng
    TokenService.removeUser();
    localStorage.removeItem("userInfo");
    console.log("User logged out and localStorage cleared");

    // Gửi yêu cầu logout đến backend nếu cần thiết
    return api.post("/auth/logout", {
      refreshToken: TokenService.getLocalRefreshToken(),
    });
  }

  // Làm mới token
  async refreshToken() {
    return api.post("/auth/token", {
      refreshToken: TokenService.getLocalRefreshToken(),
    });
  }
}

export default new AuthService();
