class TokenService {
  // Lưu access token
  setUser(accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  // Lấy access token từ localStorage
  getLocalAccessToken() {
    return localStorage.getItem("accessToken");
  }

  // Xóa thông tin người dùng (accessToken và refreshToken nếu có)
  removeUser() {
    localStorage.removeItem("accessToken");
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
