import React ,{useState} from "react";
import axios from 'axios';
import { ReactTyped } from "react-typed";
import { useNavigate } from "react-router-dom";

import "./register.css"; 

const Signup = () => {
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({fullname: "", email: "", password: "", confirmpassword: ""});
  const handlechange = (e) =>{ 
    setFormData({...formdata, [e.target.name]: e.target.value})
  };

  const handlesubmit = async (e)=>{
    e.preventDefault(); 
    try{
      const res = await axios.post("http://localhost:5001/auth/signup", formdata);
     console.log("res", res);
     
      navigate("/login");
    } catch (err){  
      console.error("Signup Error:", err);
      alert(`Error: ${err.response?.data?.message || "Something went wrong!"}`);
    }
  }
  return (
    <div className="signup-container">
      {/* Left Blue Side */}
      <div className="logo-container">
        <img src="Finovalogo.png" alt="Logo" className="logo" />
        <div className="logo-text">
          <h3 className={`name`}>Finova</h3>
          <span className={`slogan oswald spaced-text`}>Secure your wealth, Elevate your life</span>
        </div>
      </div>
      <div className="signup-left">
      <div className="animated-typing">
        <div className="static-text"> Your financial future is </div>
        <ReactTyped
          strings={[
            "Secure.",
            "in your hands.",
            "built with smart decisions.",
            " just a plan away."
          ]}
          typeSpeed = {50}
          backSpeed = {50}
          loop
        />

      </div>
        <p className={`oswald spaced-text`}>Take control of your finances with Finova. Track your expenses, set savings goals, and make smarter financial decisions—all in one place. Secure, simple, and designed to help you achieve financial freedom.</p>
      </div>

      {/* Right White Side */}
      <div className="signup-right">
        <h2>Create Account</h2>
        <p className="signup-description">
          Please enter your details to create an account.
        </p>

        {/* Signup Form */}
        <form className="signup-form" onSubmit={handlesubmit}>
          <input type="text" placeholder="Full Name" name='fullname' onChange={handlechange} required />
          <input type="email" placeholder="Email ID" name='email' onChange={handlechange} required />
          <input type="password" placeholder="Password" name='password' onChange={handlechange} required />
          <input type="password" placeholder="Confirm Password" name='confirmpassword' onChange={handlechange} required />

          {/* Checkbox for Terms & Conditions */}
          <div className="checkbox-container">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">I agree to Terms & Conditions</label>
          </div>

          {/* Signup Button */}
          <button type="submit">SIGN UP</button>

          {/* Already have an account? */}
          <p className="login-link"> 
            Already a member? <a href="/login">Login</a>
          </p>
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

export default Signup;


