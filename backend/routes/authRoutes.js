const express = require("express");
const User = require("../models/User");
const Finance = require("../models/Finance");
const router = express.Router();  

router.post("/signup", async (req, res) => {
  try {
    const { fullname, email, password, confirmpassword } = req.body; 

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Password and confirm password validation
    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Create a new user       
    const newUser = new User({ fullname, email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    userID = user.email.split("@")[0]

    // Ensure Finance record exists for the user
    let financeData = await Finance.findOne({ user_id: userID });
    if (!financeData) {
      financeData = new Finance({
        user_id: userID,
        budget: [],
        expenses: [],
        investments: [],
        goals: [],
      });
      await financeData.save();
    }

    console.log("Finance Data Retrieved:", financeData);

    const history = {
      budget: financeData.budget,
      expenses: financeData.expenses,
      investments: financeData.investments,
      goals: financeData.goals,
    };


    res.status(200).json({
      message: "Login successful",
      redirect: "/dashboard",
      history, 
      user: {
        id: user._id,
        name: user.fullname,
        email: user.email,
        permission: user.isAdmin
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/dashboard/:email", async (req, res) => {
  try {    
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.json({
      name: user.fullname,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;