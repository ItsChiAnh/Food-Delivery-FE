import api from "./api";
import TokenService from "./token.service";

class AuthService {
  // register

  async register(
    userName,
    email,
    password,
    avatar = "default-avatar.png",
    cartData = {}
  ) {
    try {
      console.log("Sending data:", {
        userName,
        email,
        password,
        avatar,
        cartData,
      });
      const response = await api.post("/auth/register", {
        userName,
        email,
        password,
        avatar,
        cartData,
      });
      console.log("Response:", response.data);
      return response;
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      throw error;
    }
  }
  // login
  async login(email, password) {
    console.log("test");
    const response = await api.post("/auth/login", { email, password });
    console.log("response", response);
    if (response.data.tokens.access_token) {
      TokenService.setUser(response.data.tokens.access_token);
    }

    return response.data;
  }

  // logout
  logout() {
    TokenService.removeUser();
    return api.post("/auth/logout", {
      refreshToken: TokenService.getLocalRefreshToken(),
    });
  }

  // refreshtoken
  async refreshToken() {
    return api.post("/auth/token", {
      refreshToken: TokenService.getLocalRefreshToken(),
    });
  }
}

export default new AuthService();
