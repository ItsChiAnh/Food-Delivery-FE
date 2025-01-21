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
    const newQuantity = (cartItems[itemId] || 0) + 1;

    // Update local cart state
    setCartItems((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    // Sync with backend
    try {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId, quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`Added item ${itemId} to cart`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // const removeFromCart = (itemId) => {
  //   setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  // };

  const removeFromCart = async (itemId) => {
    const newQuantity = (cartItems[itemId] || 0) - 1;

    // Update local cart state
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (newQuantity > 0) {
        updatedCart[itemId] = newQuantity;
      } else {
        delete updatedCart[itemId]; // Remove item if quantity is 0
      }
      return updatedCart;
    });

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    // Sync with backend
    try {
      if (newQuantity > 0) {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId, quantity: newQuantity },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      console.log(`Removed item ${itemId} from cart`);
    } catch (error) {
      console.error("Error removing item from cart:", error);
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
        // Remove the item if quantity is set to 0
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
      const token = localStorage.getItem("accessToken");
      if (!token) return; // Exit if no token is found

      try {
        const response = await axios.post(
          `${url}/api/cart/get`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Cart data fetched:", response.data.cartData);

        // Map backend cartData to the frontend cartItems format
        const cart = response.data.cartData || {};
        setCartItems(cart); // Set cart items in state
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    loadCartData();
  }, []); // Run once when the app loads

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
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

      // setCartItems(response); // Gắn giỏ hàng lấy được vào state
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
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
        console("cart data of token is: ", loadCartData);
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
