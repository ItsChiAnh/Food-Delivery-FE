import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await AuthService.login(email, password);
      console.log("user", user);
      alert("Đăng nhập thành công!");
      console.log("User Info:", user);
      setShowLogin(false); // Đóng popup
    } catch (error) {
      console.log("error", error);
      alert(error.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  // Xử lý đăng ký
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.register(name, email, password);
      console.log("Response:", response); // Log response từ API
      alert(response.data.message || "Đăng ký thành công!");
      setCurrState("Login"); // Chuyển về màn hình Login
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.Message || "Đăng ký thất bại!");
    }
  };

  // Gửi OTP để đặt lại mật khẩu
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Vui lòng nhập email!");
      return;
    }
    try {
      const response = await UserService.sendOtp(email);
      alert(response.data.message || "OTP đã được gửi!");
      setCurrState("Enter OTP");
    } catch (error) {
      alert(error.response?.data?.message || "Gửi OTP thất bại!");
    }
  };

  // Đặt lại mật khẩu với OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      alert("Vui lòng điền đầy đủ các trường!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    try {
      const response = await UserService.changePasswordWithOtp(
        email,
        otp,
        newPassword
      );
      alert(response.data.message || "Mật khẩu đã được đặt lại thành công!");
      setCurrState("Login");
    } catch (error) {
      alert(error.response?.data?.message || "Đặt lại mật khẩu thất bại!");
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="login-popup-input">
          {/* Đăng ký */}
          {currState === "Sign Up" && (
            <>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button onClick={handleSignUp}>Sign Up</button>
            </>
          )}
          {/* Quên mật khẩu */}
          {currState === "Forgot Password" && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p>We will send a one-time password (OTP) to your email.</p>
              <button onClick={handleSendOtp}>Send OTP</button>
            </>
          )}
          {/* Nhập OTP */}
          {currState === "Enter OTP" && (
            <>
              <input
                type="text"
                placeholder="Enter the OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button onClick={() => setCurrState("Reset Password")}>
                Verify OTP
              </button>
            </>
          )}
          {/* Đặt lại mật khẩu */}
          {currState === "Reset Password" && (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button onClick={handleResetPassword}>Confirm</button>
            </>
          )}
          {/* Đăng nhập */}
          {currState === "Login" && (
            <>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button onClick={handleLogin}>Login</button>
            </>
          )}
        </div>
        {/* Liên kết chuyển trạng thái */}
        {currState === "Forgot Password" && (
          <p>
            Remember your password?
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
        {currState === "Login" && (
          <>
            <p>
              Forget your password?
              <span onClick={() => setCurrState("Forgot Password")}>
                Click here
              </span>
            </p>
            <p>
              Create a new account?
              <span onClick={() => setCurrState("Sign Up")}>Click here</span>
            </p>
          </>
        )}
        {currState === "Sign Up" && (
          <p>
            Already have an account?
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
