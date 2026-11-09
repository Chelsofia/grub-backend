
const express = require("express");
const router = express.Router();

const {
  getRecipes,
  getRecipeById,
} = require("../controllers/recipeController");

router.get("/", getRecipes);
router.get("/:id", getRecipeById);

module.exports = router;
