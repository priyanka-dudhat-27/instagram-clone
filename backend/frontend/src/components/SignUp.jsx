/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import logo from "/images/insta-logo.png";
import { Link ,useNavigate} from "react-router-dom";
import "../css/SignUp.css";
import { toast } from 'react-toastify';


const SignUp = () => {
  const navigate=useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//   Toast functions
  const notyfyA=(message)=>{toast.error(message)}
  const notyfyB=(message)=>{toast.success(message)}
  const emailRegEx=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegEx=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

  const postData = () => {
    // chexk if all fields are fillup
    if(!name||!email||!password||!username){
      notyfyA('Please fill all fields')
      return
    }
    // checking email
    if(!emailRegEx.test(email)){
      notyfyA('Invalid Email')
    }else if(!passRegEx.test(password)){
      notyfyA('[8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character]')
      return
    }
    // sending data to server
    fetch("/signup", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            username: username,
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            notyfyA(data.message);
            console.log(data);
        } else {
            notyfyB(data.message);
            navigate('/signin')
        }
    })
};

  return (
    <div className="signUp">
      <div className="form-container">
        <div className="form">
          <img src={logo} alt="" className="signupLogo" />
          <p className="loginPara">
            Sign up to see Photos and Videos <br /> from your friends
          </p>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter email"
            />
          </div>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Enter fullname"
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="Enter username"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Enter password"
            />
          </div>
          <p
            className="loginPara"
            style={{ fontSize: "12px", margin: "3px 0px" }}
          >
            By signing up, you agree to our Terms, <br /> privacy policy and
            cookies policy.
          </p>
          <input type="submit" id="submit-btn" value="Sign Up" onClick={postData} />
        </div>
        <div className="form2">
          Already have an account?
          <Link to="/signin">
            <span style={{ color: "blue", cursor: "pointer" }}>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
