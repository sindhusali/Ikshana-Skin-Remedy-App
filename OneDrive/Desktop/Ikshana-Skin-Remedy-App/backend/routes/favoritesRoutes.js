const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const { protect } = require("../middleware/authMiddleware");

console.log("✅ favoritesRoutes.js loaded"); // Debugging

// ✅ Add a remedy to favorites
router.post("/", protect, async (req, res) => {
  try {
    console.log("🔹 Received POST /api/favorites", req.body);
    
    const { remedyId } = req.body;
    if (!remedyId) return res.status(400).json({ message: "Remedy ID is required." });

    console.log("🔹 Checking if remedy is already favorited...");
    const existingFavorite = await Favorite.findOne({ user: req.user.id, remedy: remedyId });

    if (existingFavorite) return res.status(400).json({ message: "Already in favorites." });

    console.log("✅ Adding to favorites...");
    const newFavorite = await Favorite.create({ user: req.user.id, remedy: remedyId });

    res.status(201).json(newFavorite);
  } catch (error) {
    console.error("❌ Error adding favorite:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Remove a remedy from favorites
router.delete("/:id", protect, async (req, res) => {
  try {
    console.log("🔹 Received DELETE /api/favorites/:id", req.params.id);

    const favorite = await Favorite.findOneAndDelete({ user: req.user.id, remedy: req.params.id });

    if (!favorite) return res.status(404).json({ message: "Favorite not found." });

    res.json({ message: "Removed from favorites." });
  } catch (error) {
    console.error("❌ Error removing favorite:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Get all favorite remedies for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    console.log("🔹 Fetching user's favorites...");

    const favorites = await Favorite.find({ user: req.user.id }).populate("remedy");

    res.json(favorites.map(fav => fav.remedy));
  } catch (error) {
    console.error("❌ Error fetching favorites:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
