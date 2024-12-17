// 1. Thư viện bên ngoài
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// 2. Module cục bộ
import { StoreContext } from "../../context/StoreContext";

// 3. File CSS và asset
import "./Cart.css";

function Cart() {
  const { cartItems, food_list, getTotalCartAmount, updateQuantity } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const SHIPPING_FEE = 2;

  const handleRemoveItem = (itemId) => {
    updateQuantity(itemId, 0); // Remove item by setting quantity to 0
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 0) {
      updateQuantity(itemId, newQuantity); // Update item quantity
    }
  };

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
                        onClick={() =>
                          handleUpdateQuantity(
                            item._id,
                            cartItems[item._id] + 1
                          )
                        }
                      >
                        + Increase Quantity
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item._id,
                            cartItems[item._id] - 1
                          )
                        }
                        disabled={cartItems[item._id] <= 1}
                      >
                        - Decrease Quantity
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        Remove Item
                      </button>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            );
          }
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
          <button onClick={() => navigate("/order")}>
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
