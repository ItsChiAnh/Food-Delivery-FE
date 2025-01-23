import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { logout } from "../../redux/slices/userSlice"; // Logout action
import "../Navbar/Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom"; // For navigation
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
function Navbar({ setShowLogin }) {
  const [menu, setMenu] = useState("menu");
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const user = useSelector((state) => state.user.userInfo); // Get user info from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getTotalCartAmount } = useContext(StoreContext);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state
    toast.success("Đăng xuất thành công!");
    navigate("/"); // Navigate to the homepage
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
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
        {/* Search Icon */}
        <img src={assets.search_icon} alt="Search" />

        {/* Cart Icon */}
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          {getTotalCartAmount() > 0 && <div className="dot"></div>}
        </div>

        {/* User Dropdown or Login Button */}
        {user ? (
          <div className="user-menu">
            <span
              className="user-name"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Hi, {user.userName}
            </span>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/myorders" className="dropdown-item">
                  My Orders
                </Link>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
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
