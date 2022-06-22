import "./signin.css";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import Alert from "../components/Alert";
import dot from "../utils/dot.svg";
import bigCircleL from "../utils/bigCircleL.svg";
import bigCircleR from "../utils/bigCircleR.svg";
import eye from "../utils/eye.svg";
import { motion } from "framer-motion";

const Signin = () => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState(null);
  const passRef = useRef();
  const [state, dispatch] = useStateValue();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: e.target.elements.log_email.value,
      password: e.target.elements.log_password.value,
    };

    const proRes = await fetch(process.env.REACT_APP_API + "/user/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const response = await proRes.json();
    if (response.token) {
      dispatch({ type: actionType.ADD_USER, payload: { user: response } });
      if (state.user.usercart.length !== 0) {state.mark = state.user.usercart[0];}
      setMsg("Login Sucessful");
      setTimeout(() => {
        setMsg(null);
        navigate("/products");
      }, 2500);
    } else {
      setMsg(response.message);
      setTimeout(() => {
        setMsg(null);
      }, 2500);
    }
  };

  // const refreshUser = async () => {
  //   const jsonData = await fetch(process.env.REACT_APP_API + "/user/signin", {
  //     method: "GET",
  //     headers: {
  //       authorization: state.user.token,
  //     },
  //   });

  //   const data = await jsonData.json();
  //   if (data.status === "success") {
  //     navigate("/products");
  //   }
  // };

  // useEffect(() => {
  //   refreshUser();
  //   // eslint-disable-next-line
  // }, []);

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
        <img src={dot} alt="dotLeft" className="dotLeft" />

        {msg ? <Alert msg={msg} /> : ""}

        <form action="" className="signForm" onSubmit={handleSubmit}>
        <div className="logo"> <img src="logo192.png" className="siteLogo" alt="siteLogo"/> Products Manager</div>

          <div className="detail">
            Enter your credentials to access your account
          </div>
          <div className="input-group">
          <input
            type="email"
            id="log_email"
            className="inputauth"
            required
          />
          <label for="log_email" className="input-label">Email Id</label></div>
          <div className="input-group">
          <input
            type="password"
            id="log_password"
            className="inputauth"
            required
            ref={passRef}
          />
          <label for="log_password" className="input-label">Password</label></div>
          <motion.img
            whileTap={{ scale: 0.95 }}
            src={eye}
            alt="eye"
            onClick={showPassword}
            className="signineye"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="btn"
          >
            Sign In
          </motion.button>
          <Link to="/signup" className="linkLogin">
            Sign up
          </Link>
        </form>

        <img src={dot} alt="dotRight" className="dotRight" />
      </div>
      <img src={bigCircleR} alt="bigCircle" className="bigCircle right" />
    </section>
  );
};

export default Signin;