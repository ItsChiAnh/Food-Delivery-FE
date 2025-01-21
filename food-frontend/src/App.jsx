import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import MyOrders from "./pages/MyOrders/MyOrders";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import { setUser } from "./redux/slices/userSlice"; // Import Redux action to set user
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useDispatch();

  // Load user and token from localStorage on app initialization
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (accessToken && userInfo) {
      // Update Redux state with the user info
      dispatch(setUser(userInfo));
    }
  }, [dispatch]);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
