import React, { useRef, useEffect, useState } from "react";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import add_to_cart from "../utils/add_to_cart.png";
import remove_from_cart from "../utils/remove_from_cart.png";
import { motion } from "framer-motion";

const SingleProduct = ({
  _id,
  Product_ID,
  product_name,
  price,
  rating,
  image,
  cartStatus,
  index,
  fetchData,
  setSucDel,
}) => {
  const [state, dispatch] = useStateValue();
  const inputRef = useRef();
  let cartImage = add_to_cart
  
  if (cartStatus){
    cartImage = remove_from_cart
  }
  const handleClick = (_id) => {
    if (!cartStatus){
    state.mark[index] = 1;
    cartStatus = true;
    inputRef.current.src = remove_from_cart
    }
    else {
      delete state.mark[index];
      cartStatus = false;
      inputRef.current.src = add_to_cart;
    }
    console.log(state.mark)
  };

  return (
      <div className="product">
        <div className="product_name">{product_name}</div>
        <motion.img
            className="action"
            whileTap={{ scale: 1.2 }}
            src={image}
            alt="Product Image"
          />
        <div className="price">Rs.{price}/-</div>
        <div className="rating">Rating: {rating} / 5.0</div>
        <div className="addToCart">
          <motion.img
            className="action"
            whileTap={{ scale: 0.8 }}
            src={cartImage}
            ref={inputRef}
            alt="Cart Status"
            onClick={() => {
              handleClick(_id);
            }}
          />
          </div>
        </div>
  );
};

export default SingleProduct;