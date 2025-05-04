import React, { useState } from "react";
import axios from "axios";
import { ReactTyped } from "react-typed";
import { useNavigate } from "react-router-dom";
import "./login.css"; 

const Login = ({ onLogin }) => {
  const navigate = useNavigate(); 
  const [formdata, setFormData] = useState({ email: "", password: "" });

  const handlechange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/auth/login", formdata); 

      const user = res.data.user;   
      const history = res.data.history || {};
      
      const username = user.email.split("@")[0]    

      localStorage.setItem("user", JSON.stringify(user)); 
      localStorage.setItem("userEmail", user.email); 
      localStorage.setItem("isAuthenticated", "true"); 
      localStorage.setItem("userHistory", JSON.stringify(history));

      onLogin(); 
      navigate("/dashboard/");
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message)); 
    }
  };

  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="logo-container">
        <img src="Finovalogo.png" alt="Logo" className="logo" />
        <div className="logo-text">
          <h3 className="name">Finova</h3>
          <span className="slogan oswald spaced-text">Secure your wealth, Elevate your life</span>
        </div>
      </div>
      <div className="login-left">
        <div className="animated-typing">
          <div className="static-text"> Your financial future is </div>
          <ReactTyped
            strings={[
              "Secure.",
              "in your hands.",
              "built with smart decisions.",
              " just a plan away."
            ]}
            typeSpeed={50}
            backSpeed={50}
            loop
          />
        </div>
        <p className="oswald spaced-text">
          Take control of your finances with Finova. Track your expenses, set savings goals, and make smarter financial decisions—all in one place.
          Secure, simple, and designed to help you achieve financial freedom.
        </p>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <h2 className="login-title">Login Account</h2>
        <p className="login-description">
          Please enter your credentials to log in to your account.
        </p>

        {/* Login Form */}
        <form onSubmit={handlesubmit}>
          <input type="email" placeholder="Email ID" name="email" onChange={handlechange} required />
          <input type="password" placeholder="Password" name="password" onChange={handlechange} required /> {/* ✅ Fixed input name */}

          <div className="options">
            <label>
              <input type="checkbox" /> Keep me signed in
            </label>
           
            <a href="/">Don't have an account</a>
          </div>

          <button type="submit">LOGIN</button> {/* ✅ Fixed button text */}
        </form>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Finova. All rights reserved.</p>
          <p>IPS technologies pvt Ltd</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;   