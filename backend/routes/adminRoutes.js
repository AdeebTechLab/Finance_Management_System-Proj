const express = require("express");
const router = express.Router();
const User = require("../models/User");
const adminAuth = require("../middleware/authMiddleware");

// Get all users (excluding admins)
router.get("/users", async (req, res) => {
  try {  
    const users = await User.find();
    console.log(users) 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 
// Edit user details
router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
});

// Delete user
router.delete("/users/:email", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ email: req.params.email });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
