import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
function Footer() {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>
            Pure Plant-Based Delights. Savor the Future of Flavor. Nourishing
            Bodies, Nurturing the Planet.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Homee</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+84 902-391-912</li>
            <li>contactus@tomato.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright © 2024 Tomato.com - All Rights Reserved{" "}
      </p>
    </div>
  );
}

export default Footer;
