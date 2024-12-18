import api from "./api";

class UserService {
  // Gửi OTP
  async sendOtp(email) {
    return api.post("/auth/send-otp", { email });
  }

  // Đổi mật khẩu với OTP
  async changePasswordWithOtp(email, otp, newPass) {
    return api.put("/auth/change-password", { email, otp, newPass });
  }

  // Cập nhật thông tin người dùng
  async updateUserInfo(userId, newName, newAvatar) {
    return api.put("/auth/change-info", { userId, newName, newAvatar });
  }
}

export default new UserService();
