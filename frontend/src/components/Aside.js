import React, { useEffect, useRef, useState } from "react";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { useNavigate } from "react-router-dom";
import cart from "../utils/cart.png";
import products from "../utils/products.png";
import signOut from "../utils/signOut.svg";
import { motion } from "framer-motion";
import Popup from "./Popup";

const Aside = () => {
  // eslint-disable-next-line
  const [state, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [isPop, setIsPop] = useState(false);
  
  const handleClick = async () => {
    dispatch({ type: actionType.REMOVE_USER });
    navigate("/");
  };
  return (
    <aside className="sidebar">
      <div className="sidetop">
        <motion.p whileTap={{ scale: 0.6 }} className="asidelogo">
        <div className="asidelogo"> <img src="logo192.png" alt="siteLogo"/> Products Manager</div>
        </motion.p>
        <div>
          <motion.img
            whileTap={{ scale: 0.6 }}
            src={cart}
            alt="cart"
            className="cart"
            onClick={() => {isPop ? setIsPop(false):setIsPop(true)}}
          />
          {isPop ? 
                (<Popup
                setIsPop={setIsPop}
              />) : ("")}
          <motion.img
            whileTap={{ scale: 0.6 }}
            src={products}
            alt="totalContact"
            className="productsTabs"
          />
        </div>
      </div>

      <motion.img
        whileTap={{ scale: 0.95 }}
        src={signOut}
        alt="signOut"
        onClick={handleClick}
        className="signOutBtn"
      />
    </aside>
  );
};

export default Aside;