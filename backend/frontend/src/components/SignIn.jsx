/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useContext } from "react";
import "../css/SignIn.css";
import logo from "/images/insta-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginContext } from "../context/ContextLogin";

const SignIn = () => {
  const { setUserLogin } = useContext(LoginContext);
  const navigate = useNavigate();
  const notifyA = (message) => toast.error(message);
  const notifyB = (message) => toast.success(message);
  const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const postData = () => {
    if (!emailRegEx.test(email)) {
      notifyA("Please enter a valid email");
      return;
    }
    if (!password) {
      notifyA("Please enter your password");
      return;
    }

    // Sending data to server
    fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", JSON.stringify(data));
        if (data.error) {
          notifyA(data.error);
          return;
        } else {
          notifyB(data.message);
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUserLogin(true);
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        notifyA("An error occurred. Please try again later.");
      });
  };

  return (
    <div className="signIn">
      <div className="loginForm">
        <img src={logo} alt="" className="signupLogo" />
        <div>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <input type="submit" id="login-btn" value="Log In" onClick={postData} />
      </div>
      <div className="loginForm2">
        Don't have an account?
        <Link to="/signup">
          <span style={{ color: "blue", cursor: "pointer" }}>Sign Up</span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
