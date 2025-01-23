import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from "../../context/StoreContext";

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();

  //fix
  const { setToken } = useContext(StoreContext);

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.warn("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      const response = await AuthService.login(email, password);
      toast.success("Đăng nhập thành công!");

      // Lưu thông tin vào localStorage và Redux
      // localStorage.setItem("accessToken", response.tokens.access_token);
      // localStorage.setItem("userInfo", JSON.stringify(response.userinfo));
      dispatch(setUser(response.userinfo));
      //fix
      const token = response.tokens.access_token;
      setToken(token);

      setShowLogin(false); // Đóng popup
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  // Xử lý đăng ký
  // Xử lý đăng ký
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !password || !confirmPassword) {
        toast.warn("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Mật khẩu và Xác nhận mật khẩu không khớp!");
        return;
      }

      const response = await AuthService.register(name, email, password);
      toast.success(response.data.message || "Đăng ký thành công!");
      setCurrState("Login"); // Chuyển về màn hình đăng nhập
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  // Xử lý gửi OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        toast.warn("Vui lòng nhập email!");
        return;
      }

      const response = await UserService.sendOtp(email);
      toast.success(response.data.message || "OTP đã được gửi!");
      setCurrState("Enter OTP");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gửi OTP thất bại!");
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (!newPassword || !confirmPassword) {
        toast.warn("Vui lòng nhập mật khẩu mới và xác nhận mật khẩu!");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Mật khẩu không khớp!");
        return;
      }

      const response = await UserService.changePasswordWithOtp(
        email,
        otp,
        newPassword
      );
      toast.success(response.data.message || "Đặt lại mật khẩu thành công!");
      setCurrState("Login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Đặt lại mật khẩu thất bại!"
      );
    }
  };
  function checkSubmit(e) {
    if (e && e.keyCode == 13) {
      document.forms[0].submit();
    }
  }
  return (
    <div className="login-popup">
      <form
        className="login-popup-container"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent form submission
        }}
        onKeyPress={checkSubmit()}
      >
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <button onClick={() => setShowLogin(false)} className="close-button">
            ✕
          </button>
        </div>
        <div className="login-popup-input">
          {currState === "Login" && (
            <>
              <input
                type="email"
                placeholder="Email"
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
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <button onClick={handleLogin}>Login</button>
              <p>
                Forgot your password?{" "}
                <span onClick={() => setCurrState("Forgot Password")}>
                  Click here
                </span>
              </p>
              <p>
                Don’t have an account?{" "}
                <span onClick={() => setCurrState("Sign Up")}>Sign up</span>
              </p>
            </>
          )}

          {currState === "Sign Up" && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
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
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
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
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <button onClick={handleSignUp}>Sign Up</button>
            </>
          )}

          {currState === "Forgot Password" && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button onClick={handleSendOtp}>Send OTP</button>
            </>
          )}

          {currState === "Enter OTP" && (
            <>
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button onClick={() => setCurrState("Reset Password")}>
                Verify OTP
              </button>
            </>
          )}

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
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
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
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
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
