
const User = require("../models/User");

const adminAuth = async (req, res, next) => { 
  try { 
    const userdata = localStorage.getItem("user")
    const user = await User.findById(decoded.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = adminAuth;
