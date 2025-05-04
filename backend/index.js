const express = require("express");
const cors = require("cors");

const { authDB, financeDB } = require("./db");
const authRoutes = require("./routes/authRoutes");
const financeRoutes = require("./routes/financeRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ✅ Import admin routes

const app = express();

// Middleware
app.use(express.json());

const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use("/auth", authRoutes);
app.use("/api", financeRoutes);
app.use("/api/admin", adminRoutes);  

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
