
const mongoose = require("mongoose");
const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe");

// Get all favorites belonging to the logged-in user
const getFavorites = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user.id,
    }).populate("favorites");

    res.status(200).json({
      favorites: favorite ? favorite.favorites : [],
    });
  } catch (error) {
    console.error("GET FAVORITES ERROR:", error);

    res.status(500).json({
      message: "Failed to retrieve favorites",
      error: error.message,
    });
  }
};

// Add a recipe to favorites
const addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({
        message: "Invalid recipe ID",
      });
    }

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    const favorite = await Favorite.findOneAndUpdate(
      { user: req.user.id },
      {
        $addToSet: { favorites: recipeId },
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      }
    ).populate("favorites");

    res.status(200).json({
      message: "Recipe added to favorites",
      favorites: favorite.favorites,
    });
  } catch (error) {
    console.error("ADD FAVORITE ERROR:", error);

    res.status(500).json({
      message: "Failed to add favorite",
      error: error.message,
    });
  }
};

// Remove a recipe from favorites
const removeFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({
        message: "Invalid recipe ID",
      });
    }

    const favorite = await Favorite.findOneAndUpdate(
      { user: req.user.id },
      {
        $pull: { favorites: recipeId },
      },
      {
        returnDocument: "after",
      }
    ).populate("favorites");

    if (!favorite) {
      return res.status(404).json({
        message: "No favorites found for this user",
      });
    }

    res.status(200).json({
      message: "Recipe removed from favorites",
      favorites: favorite.favorites,
    });
  } catch (error) {
    console.error("REMOVE FAVORITE ERROR:", error);

    res.status(500).json({
      message: "Failed to remove favorite",
      error: error.message,
    });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
