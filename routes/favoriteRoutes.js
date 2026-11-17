
const express = require("express");
const router = express.Router();

const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");

const protect = require("../middleware/authMiddleware");

// All favorites routes require authentication
router.get("/", protect, getFavorites);

router.post("/:recipeId", protect, addFavorite);

router.delete("/:recipeId", protect, removeFavorite);

module.exports = router;
