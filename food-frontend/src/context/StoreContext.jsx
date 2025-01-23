import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://food-delivery-be-xk4s.onrender.com";
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");

  // const addToCart = (itemId) => {
  //   if (!cartItems[itemId]) {
  //     setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
  //   } else {
  //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  //   }
  // };

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    }
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Api response: ", response.data);
      } catch (error) {
        console.error("Error adding to cart: ", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    if (!cartItems[itemId] || cartItems[itemId] <= 0) {
      console.warn("Item not in cart or quantity is already zero.");
      return;
    }
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] === 1) {
        delete updatedCart[itemId];
      } else {
        updatedCart[itemId] -= 1;
      }
      return updatedCart;
    });

    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Cart updated after removal: ", response.data);
      } catch (error) {
        console.error("Error removing item from cart: ", error);
      }
    }
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 0) {
      console.warn("Quantity cannot be negative. Can't update.");
      return;
    }
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (quantity === 0) {
        delete updatedCart[itemId];
      } else {
        updatedCart[itemId] = quantity;
      }
      return updatedCart;
    });
  };
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getDetailProduct = async (id) => {
    const response = await axios.post(url + "/api/food/findid", { id });
    return response.data;
  };

  useEffect(() => {
    const loadCartData = async () => {
      const token = localStorage.getItem("access_token");
      console.log(token);
      if (!token) {
        console.log("no token!");
        return;
      } // Exit if no token is found

      try {
        const response = await axios.post(
          url + "/api/cart/get",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Cart data fetched:", response.data.cartData);

        const cart = response.data.cartData || {};
        setCartItems(cart); // Set cart items in state
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    loadCartData();
  }, [token]); // Run once when the app loads

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCartData = async (token) => {
    if (!token) {
      console.log("No token found");
      return;
    }
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Cart data response: ", response.data);
      if (response.data.cartData) {
        setCartItems((prev) => {
          console.log("Previous cart items: ", prev);
          console.log("New cart items: ", response.data.cartData);
          return { ...response.data.cartData };
        });
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const fetchUserCart = async (userToken) => {
    console.log("hi", userToken);
    try {
      const response = await axios.get(url + "/api/cart/get", {
        headers: {
          Authorization: `Bearer ${userToken}`, // Truyền access token qua header
        },
      });
      console.log("User Cart:", response.data.cartData);
      setCartItems(response.data.cartData); // Gắn giỏ hàng lấy được vào state
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  };

  const AddUserCart = async (userToken, itemId, newQuantity) => {
    console.log("Attempting to add item to cart:", { itemId, newQuantity });

    if (!userToken) {
      console.error("No user token found.");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/cart/add`,
        { itemId, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // Ensure token is included
          },
        }
      );

      console.log("Cart updated:", response.data);
      updateQuantity(itemId, newQuantity); // Update cart locally
    } catch (error) {
      console.error(
        "Error adding item to cart:",
        error.response?.data || error.message
      );
    }
  };

  const removeUserCart = async (userToken, itemId) => {
    try {
      const response = await axios.post(
        url + "/api/cart/remove",
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // Truyền access token qua header
          },
        }
      );
      await fetchUserCart(userToken);

      console.log("remove", response);
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const accToken = localStorage.getItem("access_token");
      if (accToken) {
        setToken(accToken);
        await loadCartData(accToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    updateQuantity,
    url,
    token,
    setToken,
    getDetailProduct,
    fetchUserCart,
    AddUserCart,
    removeUserCart,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
