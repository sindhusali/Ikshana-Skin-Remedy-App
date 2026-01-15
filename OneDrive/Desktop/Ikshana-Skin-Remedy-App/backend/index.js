const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Ensures backend can parse JSON requests

// Connect to MongoDB
connectDB();
const favoriteRoutes = require("./routes/favoritesRoutes");
// Routes
app.use("/api/auth", require("./routes/userRoutes")); // ✅ User routes
app.use("/api/remedies", require("./routes/remedyRoutes"));
// Use the favorites API route
app.use("/api/favorites", favoriteRoutes);
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port: ${port}`));



