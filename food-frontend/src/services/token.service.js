class TokenService {
  // Lưu access token
  setUser(accessToken) {
    localStorage.setItem("access_token", accessToken);
  }

  // Lấy access token từ localStorage
  getLocalAccessToken() {
    return localStorage.getItem("access_token");
  }

  // Xóa thông tin người dùng (accessToken và refreshToken nếu có)
  removeUser() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refreshToken"); // Nếu sử dụng refresh token
  }

  // Nếu sử dụng refresh token:
  setLocalRefreshToken(refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  getLocalRefreshToken() {
    return localStorage.getItem("refreshToken");
  }

  removeRefreshToken() {
    localStorage.removeItem("refreshToken");
  }
}

export default new TokenService();
