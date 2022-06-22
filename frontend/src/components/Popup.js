import React from "react";
import { useStateValue } from "../context/StateProvider";
import SingleProduct from "./SingleProduct";

const Popup = ({ setIsPop, setSuccessUp }) => {
  const [state, dispatch] = useStateValue();

  const handleChange = async (file) => {
    setIsPop(false);
  };
  return (
    <div className="popup">
      {Object.keys(state.mark).map((obj) => (
              <SingleProduct
              key={state.product[obj].Product_ID}
              {...state.product[obj]}
              cartStatus = {obj.Product_ID in state.mark ? true : false}
            />
            ))}
    </div>
  );
};

export default Popup;