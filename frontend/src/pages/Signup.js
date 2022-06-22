import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import dot from "../utils/dot.svg";
import bigCircleL from "../utils/bigCircleL.svg";
import bigCircleR from "../utils/bigCircleR.svg";
import eye from "../utils/eye.svg";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState(null);
  const passRef = useRef();
  const [wrongPass, setWrongPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      e.target.elements.reg_password.value !==
      e.target.elements.c_reg_password.value
    ) {
      setTimeout(() => {
        setWrongPass(false);
      }, 2500);
      return setWrongPass(true);
    }
    const data = {
      full_name: e.target.elements.reg_full_name.value,
      email: e.target.elements.reg_email.value,
      password: e.target.elements.reg_password.value,
      phone: e.target.elements.reg_phone.value
    };

    const proRes = await fetch(process.env.REACT_APP_API + "/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const response = await proRes.json();
    if (response.status === "success") {
      setMsg(response.message);
      setTimeout(() => {
        setMsg(null);
        navigate("/");
      }, 2500);
    } else {
      setMsg(response.message);
      setTimeout(() => {
        setMsg(null);
      }, 2500);
    }
  };

  function showPassword(e) {
    var x = passRef.current;
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }

  return (
    <section className="loginContainer">
      <img src={bigCircleL} alt="bigCircle" className="bigCircle left" />
      <div className="mainLogIn">
        {msg ? <Alert msg={msg} /> : ""}
        {wrongPass ? <div className="alert">Password does't match</div> : ""}
        <img src={dot} alt="dotLeft" className="dotLeft" />

        <form action="" className="signForm" onSubmit={handleSubmit}>
          <div className="logo"> <img src="logo192.png" className="siteLogo" alt="siteLogo"/> Products Manager</div>

          <div className="detail">Create New Account</div>
          <div className="input-group">
          <input
            type="text"
            id="reg_full_name"
            className="inputauth"
            required
          />
          <label for="reg_full_name" className="input-label">Full Name</label></div>
          <div className="input-group">
          <input
            type="text"
            id="reg_phone"
            className="inputauth"
            required
          />
          <label for="reg_phone" className="input-label">Phone Number</label></div>
          <div className="input-group">
          <input
            type="email"
            id="reg_email"
            className="inputauth"
            required
          />
          <label for="reg_email" className="input-label">Email Id</label></div>
          <div className="input-group">
          <input
            type="password"
            id="reg_password"
            className="inputauth"
            required
            ref={passRef}
          />
          <label for="reg_password" className="input-label">Password</label></div>
          <div className="input-group">
          <input
            type="password"
            id="c_reg_password"
            className="inputauth"
            required
          />
          <label for="c_reg_password" className="input-label">Confirm Password</label></div>
          <motion.img
            whileTap={{ scale: 0.95 }}
            src={eye}
            alt="eye"
            onClick={showPassword}
            className="signupeye"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="btn"
          >
            Sign Up
          </motion.button>
        </form>

        <img src={dot} alt="dotRight" className="dotRight" />
      </div>
      <img src={bigCircleR} alt="bigCircle" className="bigCircle right" />
    </section>
  );
};

export default Signup;