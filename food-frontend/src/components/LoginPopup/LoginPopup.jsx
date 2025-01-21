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
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility
  const dispatch = useDispatch();

  const cartData = JSON.parse(localStorage.getItem("cartData")) || [];

  useEffect(() => {
    if (setShowLogin) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [setShowLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(email, password);
      toast.success("Đăng nhập thành công!");
      dispatch(setUser(response.userinfo));

      if (response.tokens.access_token) {
        localStorage.setItem("accessToken", response.tokens.access_token);
      }

      setShowLogin(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.register(
        name,
        email,
        password,
        cartData
      );
      toast.success(response.data.message || "Đăng ký thành công!");
      setCurrState("Login");
    } catch (error) {
      toast.error(error.response?.data?.Message || "Đăng ký thất bại!");
    }
  };

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
          {/* Login */}
          {currState === "Login" && (
            <>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button onClick={handleLogin}>Login</button>
              <p>
                Forget your password?
                <span onClick={() => setCurrState("Forgot Password")}>
                  {" "}
                  Click here
                </span>
              </p>
              <p>
                Create a new account?
                <span onClick={() => setCurrState("Sign Up")}> Click here</span>
              </p>
            </>
          )}
          {/* Sign Up */}
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
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="password-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button onClick={handleSignUp}>Sign Up</button>
            </>
          )}
          {/* Forgot Password */}
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
          {/* Enter OTP */}
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
          {/* Reset Password */}
          {currState === "Reset Password" && (
            <>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="password-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button onClick={handleResetPassword}>Confirm</button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopup;
