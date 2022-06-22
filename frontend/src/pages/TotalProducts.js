import React from "react";
import AllProducts from "../components/AllProducts";
import Aside from "../components/Aside";
import Header from "../components/Header";
import Mobile from "../components/Mobile";

const TotalProducts = () => {
  return (
    <>
      <Mobile />
      <div className="mailContainer">
        <Aside />
        <div className="innerContainer">
          <Header />
          <AllProducts />
        </div>
      </div>
    </>
  );
};

export default TotalProducts;