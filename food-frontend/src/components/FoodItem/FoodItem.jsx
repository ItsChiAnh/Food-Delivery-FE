import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { Modal, Button } from "antd";

function FoodItem({ id, name, price, description, image }) {
  const { cartItems, addToCart, removeFromCart, url, getDetailProduct } =
    useContext(StoreContext);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const showModal = async () => {
    setIsModalVisible(true);
    setLoading(true);
    try {
      const details = await getDetailProduct(id);
      console.log(details);
      setProductDetails(details);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setProductDetails(null); // Reset chi tiết sản phẩm khi đóng modal
  };

  const handleAddToCart = () => {
    console.log("Adding to cart. Item ID:", id);
    addToCart(id); // Pass the item ID to add it to the cart
  };

  return (
    <>
      <Modal
        title="Product Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={false}
      >
        {loading ? (
          <p>Loading...</p>
        ) : productDetails ? (
          <div className="Modal-body">
            <div>
              <img
                className="food-item-image"
                src={image}
                alt=""
                style={{
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div
              style={{
                padding: "5px",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
              <h3 className="text-lg">{productDetails.name}</h3>
              <p>{productDetails.description}</p>
              <p>${productDetails.price}</p>
              <Button
                onClick={() => addToCart(id)}
                type="primary"
                style={{ marginTop: "auto" }}
              >
                Add to cart
              </Button>
            </div>
          </div>
        ) : (
          <p>Product details not available.</p>
        )}
      </Modal>

      <div className="food-item">
        <div className="food-item-img-container">
          <img
            onClick={() => showModal()}
            className="food-item-image"
            src={image}
            alt=""
          />
          {!cartItems[id] ? (
            <img
              className="add"
              onClick={handleAddToCart}
              src={assets.add_icon_white}
            />
          ) : (
            <div className="food-item-counter">
              <img
                onClick={() => removeFromCart(id)}
                src={assets.remove_icon_red}
                alt=""
              />
              <p>{cartItems[id]}</p>
              <img
                onClick={handleAddToCart}
                src={assets.add_icon_green}
                alt=""
              />
            </div>
          )}
        </div>
        <div className="food-item-info" onClick={() => showModal()}>
          <div className="food-item-name-rating">
            <p>{name}</p>
            <img src={assets.rating_starts} alt="" />
          </div>
          <p className="food-item-desc">{description}</p>
          <p className="food-item-price">${price}</p>
        </div>
      </div>
    </>
  );
}

export default FoodItem;
