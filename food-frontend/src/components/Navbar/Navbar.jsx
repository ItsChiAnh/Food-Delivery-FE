import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import { logout } from "../../redux/slices/userSlice"; // Import action logout
import "../Navbar/Navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

function Navbar({ setShowLogin }) {
  const [menu, setMenu] = useState("menu");
  const [dropdownOpen, setDropdownOpen] = useState(false); // Trạng thái dropdown
  const user = useSelector((state) => state.user.userInfo); // Lấy thông tin người dùng từ Redux Store
  const dispatch = useDispatch();
  const { getTotalCartAmount } = useContext(StoreContext);

  const handleLogout = () => {
    dispatch(logout()); // Xóa trạng thái người dùng trong Redux
    alert("Đăng xuất thành công!");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-dowload"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile-app
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {user ? (
          <div
            className="user-menu"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            {dropdownOpen ? (
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <span>Hi, {user.userName}</span>
            )}
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
