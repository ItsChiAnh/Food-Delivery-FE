import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email!");
      return;
    }
    // console.log("OTP sent to:", email);
    setCurrState("Enter OTP");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp) {
      alert("Please enter the OTP!");
      return;
    }
    // console.log("Verifying OTP:", otp);
    alert("OTP verified successfully!");
    setCurrState("Reset Password");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      alert("Please fill in all the fields!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // console.log("Password reset successfully!");
    alert("Password has been reset successfully!");
    setCurrState("Login");
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill in all the fields!");
      return;
    }
    // console.log("Account created successfully:", { name, email, password });
    alert("Account created successfully!");
    setCurrState("Login");
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-input">
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
          {currState === "Enter OTP" && (
            <>
              <input
                type="text"
                placeholder="Enter the OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button onClick={handleVerifyOtp}>Verify OTP</button>
            </>
          )}
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
              <button>Login</button>
            </>
          )}
        </div>
        {currState === "Forgot Password" && (
          <p>
            Remember your password?
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
        {currState === "Enter OTP" && (
          <p>
            Didn't receive the OTP?
            <span onClick={() => setCurrState("Forgot Password")}>
              Resend OTP
            </span>
          </p>
        )}
        {currState === "Login" && (
          <p>
            Forget your password?
            <span onClick={() => setCurrState("Forgot Password")}>
              Click here
            </span>
          </p>
        )}
        {currState === "Login" ? (
          <p>
            Create a new account?
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : currState === "Sign Up" ? (
          <p>
            Already have an account?
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        ) : null}
      </form>
    </div>
  );
};

export default LoginPopup;
