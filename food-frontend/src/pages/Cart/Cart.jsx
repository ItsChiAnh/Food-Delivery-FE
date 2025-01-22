// 1. Thư viện bên ngoài
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// 2. Module cục bộ
import { StoreContext } from "../../context/StoreContext";

// 3. File CSS và asset
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    food_list,
    getTotalCartAmount,
    updateQuantity,
    AddUserCart,
    removeUserCart,
    addToCart,
    removeFromCart,
  } = useContext(StoreContext);
  const navigate = useNavigate();

  // Retrieve the token
  // const userToken = localStorage.getItem("access_token");
  // if (!userToken) {
  //   console.error("No user token found. Cannot perform cart actions.");
  //   return;
  // }
  // console.log("userToken", userToken);

  const SHIPPING_FEE = 2;

  // Handle adding items to the cart
  // const handleAddToCart = async (itemId) => {
  //   if (!userToken) {
  //     alert("Please log in to add items to your cart.");
  //     return;
  //   }
  //   try {
  //     await AddUserCart(userToken, itemId, cartItems[itemId] + 1 || 1); // Increment quantity
  //     console.log(`Added item ${itemId} to cart`);
  //   } catch (error) {
  //     console.error("Error adding item to cart:", error);
  //   }
  // };

  // const handleAddtoCart = async (itemId) => {
  //   try {
  //     await addToCart(itemId);
  //     console.log(`Added item ${itemId} to cart`);
  //   } catch (error) {
  //     console.error("error adding: ", error);
  //   }
  // };

  // Handle removing items from the cart
  // const handleRemoveFromCart = async (itemId) => {
  //   if (!userToken) {
  //     alert("Please log in to remove items from your cart.");
  //     return;
  //   }
  //   try {
  //     const newQuantity = cartItems[itemId] - 1;
  //     if (newQuantity > 0) {
  //       await AddUserCart(userToken, itemId, newQuantity); // Decrement quantity
  //     } else {
  //       await removeUserCart(userToken, itemId); // Remove item if quantity is 0
  //     }
  //     console.log(`Removed item ${itemId} from cart`);
  //   } catch (error) {
  //     console.error("Error removing item from cart:", error);
  //   }
  // };

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
                    <button
                      onClick={() => addToCart(item._id)}
                      className="action-button"
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
