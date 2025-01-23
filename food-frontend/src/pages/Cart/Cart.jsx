import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    food_list,
    getTotalCartAmount,
    addToCart,
    removeFromCart,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const userToken = localStorage.getItem("access_token"); // Retrieve the token

  const SHIPPING_FEE = 2;

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Actions</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <div className="actions-dropdown">
                    <button className="action-button">Actions ▼</button>
                    <div className="action-menu">
                      <button
                        onClick={() => addToCart(item._id)}
                        className="add-button"
                      >
                        + Add
                      </button>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="delete-button"
                      >
                        - Remove
                      </button>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : SHIPPING_FEE}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                $
                {getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + SHIPPING_FEE}
              </b>
            </div>
          </div>
          <button
            onClick={() => {
              if (!userToken) {
                alert("Please log in to proceed to checkout.");
                return;
              }
              navigate("/order");
            }}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it in here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
