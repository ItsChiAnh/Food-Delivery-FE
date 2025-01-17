import React, { useState, useEffect } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const LoginPopup = ({ setShowLogin }) => {
  
  const [currState, setCurrState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false); //state quan li hien mk
  const dispatch = useDispatch();

  useEffect(() => {
    // setEmail("");
    setPassword("");
    setName("");
    // setOtp("");
    // setNewPassword("");
    // setConfirmPassword("");
  }, [currState]);

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(email, password);
      toast.success("Đăng nhập thành công!");

      dispatch(setUser(response.userinfo)); // Cập nhật thông tin người dùng vo Redux Store

      if (response.tokens.access_token) {
        localStorage.setItem("accessToken", response.tokens.access_token);
      }

      setShowLogin(false); // Đóng popup
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  // Xử lý đăng ký
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.register(name, email, password);
      console.log("Response:", response); // Log response từ API
      toast.success(response.data.message || "Đăng ký thành công!");
      setCurrState("Login"); // Chuyển về màn hình Login
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.Message || "Đăng ký thất bại!");
    }
  };

  // Gửi OTP để đặt lại mật khẩu
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warn("Vui lòng nhập email!");
      return;
    }
    try {
      const response = await UserService.sendOtp(email);
      toast.success(response.data.message || "OTP đã được gửi!");
      setCurrState("Enter OTP");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gửi OTP thất bại!");
    }
  };

  // Đặt lại mật khẩu với OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.warn("Vui lòng điền đầy đủ các trường!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }
    try {
      const response = await UserService.changePasswordWithOtp(
        email,
        otp,
        newPassword
      );
      toast.success(
        response.data.message || "Mật khẩu đã được đặt lại thành công!"
      );
      setCurrState("Login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Đặt lại mật khẩu thất bại!"
      );
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
