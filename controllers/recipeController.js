
const Recipe = require("../models/Recipe");

const getRecipes = async (req, res) => {
  try {
    const { search, letter } = req.query;

    const filter = {};

    if (search) {
      filter.name = {
        $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    } else if (letter) {
      filter.name = {
        $regex: `^${letter}`,
        $options: "i",
      };
    }

    const recipes = await Recipe.find(filter).sort({ name: 1 });

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve recipes",
    });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recipe",
    });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
};
