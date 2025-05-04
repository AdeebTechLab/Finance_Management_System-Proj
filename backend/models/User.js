const mongoose = require("mongoose");
const { authDB } = require("../db"); // Ensure this is properly imported

if (!authDB) {
    throw new Error("authDB is not initialized. Ensure database connection is established before using models.");
}

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: {
        type: String, 
        unique: true
    },
    password: String,
    confirmpassword: String,
    isAdmin: { type: Boolean, default: false }, 
    created_at: { type: Date, default: Date.now }
});

module.exports = authDB.model("User", UserSchema);
