import React, { useEffect, useRef, useState } from "react";
import { useStateValue } from "../context/StateProvider";
import SingleProduct from "./SingleProduct";
import { actionType } from "../context/reducer";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import selectDate from "../utils/selectDate.svg";
import add_to_cart from "../utils/add_to_cart.png";
import importP from "../utils/import.svg";
import exportP from "../utils/export.svg";
import { motion } from "framer-motion";
import Confirm from "./Confirm";
import successDelete from "./SuccessDelete";
import SuccessUpload from "./SuccessUpload";


const AllProducts = () => {
  const navigate = useNavigate();
  const [isPop, setIsPop] = useState(false);
  const [conf, setConf] = useState(false);
  const [sucDel, setSucDel] = useState(false);
  const [state, dispatch] = useStateValue();
  const [successUp, setSuccessUp] = useState(false);
  const inputRef = useRef();

  const fetchData = async () => {
    const jsonData = await fetch(process.env.REACT_APP_API + "/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: state.user.token,
      },
    });

    const data = await jsonData.json();
    if (data) {
      dispatch({
        type: actionType.ADD_PRODUCTSDATA,
        payload: { product: data },
      });
      state.product = data
    } else {
      dispatch({ type: actionType.REMOVE_USER });
      navigate("/");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   if (state.isChecked) {
  //     inputRef.current.checked = true;
  //   } else {
  //     inputRef.current.checked = false;
  //   }
  // });

  const handleDelete = async () => {
    const getRes = await fetch(process.env.REACT_APP_API + "/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: state.user.token,
      },
      body: JSON.stringify(state.mark),
    });

    const response = await getRes.json();
    dispatch({ type: actionType.REMOVE_MARK });
    fetchData();
    setConf(false);

    if (Object.keys(response.data).length) {
      setSucDel(true);
      setTimeout(() => {
        setSucDel(false);
      }, 2000);
    }

    console.log(response);
  };

  const download = async () => {
    if (Object.keys(state.mark).length === 0)
      return window.alert("Please Select some product first");
    const jsonResponse = await fetch(process.env.REACT_APP_API + "/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: state.user.token,
      },
      body: JSON.stringify(state.mark),
    });
    const response = await jsonResponse.json();
    if (response.status === "success") {
      window.location.href = response.link;
    } else {
      navigate("/");
    }
  };

  return (
    <div className="mainpage">
      <section className="hero">
        {successUp ? <SuccessUpload /> : ""}
        {sucDel ? <successDelete /> : ""}
        {conf ? <Confirm setConf={setConf} handleDelete={handleDelete} /> : ""}
        {isPop ? (
          <Popup
            fetchData={fetchData}
            setIsPop={setIsPop}
            setSuccessUp={setSuccessUp}
          />
        ) : (
          ""
        )}
          <div className="allProducts">
            {state.product.map((obj,index) => (
              <SingleProduct
              key={obj._id}
              {...obj}
              index = {index}
              cartStatus = {obj.Product_ID in state.mark ? true : false}
              fetchData={fetchData}
              setSucDel={setSucDel}
            />
          ))}
          </div>
      </section>
    </div>
  );
};

export default AllProducts;