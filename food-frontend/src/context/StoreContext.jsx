import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState("");
  const url = "http://localhost:4000";
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
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
<<<<<<< HEAD

  const getDetailProduct = async (id) => {
    const response = await axios.post(url + "/api/food/findid", { id });
    return response.data;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    console.log(response);
    setFoodList(response.data.data);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);
=======
>>>>>>> c6f5ab9ab53f426cbd8866914086e27be86acd0c

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    updateQuantity,
<<<<<<< HEAD
    url,
    token,
    setToken,
    getDetailProduct,
=======
>>>>>>> c6f5ab9ab53f426cbd8866914086e27be86acd0c
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
