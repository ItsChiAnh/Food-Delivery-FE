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
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  // const removeFromCart = (itemId) => {
  //   setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  // };
  const removeFromCart = async (item) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
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

  const getCartProduct = async () => {
    const response = await axios.get(url + "/api/cart/get");
    console.log("getCartProduct", response);
  };

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
    console.log("hi", userToken);
    try {
      const response = await axios.post(
        url + "/api/cart/add",
        { itemId, newQuantity },
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // Truyền access token qua header
          },
        }
      );

      updateQuantity(itemId, newQuantity);
      // setCartItems(response); // Gắn giỏ hàng lấy được vào state
      await fetchUserCart(userToken);
      console.log("User Cart:", response);
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
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
