
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Recipe = require("../models/Recipe");

const API_URL = "https://www.themealdb.com/api/json/v1/1";

// Get ingredients and their measurements
const extractIngredients = (meal) => {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();

    if (name) {
      ingredients.push({
        name,
        measure: measure || "",
      });
    }
  }

  return ingredients;
};

// Convert TheMealDB recipe into our own Recipe format
const formatRecipe = (meal) => ({
  name: meal.strMeal,
  description: "",
  image: meal.strMealThumb,
  category: meal.strCategory || "Other",
  area: meal.strArea || "",
  ingredients: extractIngredients(meal),
  instructions: meal.strInstructions,
  youtubeUrl: meal.strYoutube || "",
  tags: meal.strTags
    ? meal.strTags.split(",").map((tag) => tag.trim())
    : [],
  source: "TheMealDB",
  sourceId: meal.idMeal,
});

const importRecipes = async () => {
  try {
    await connectDB();

    let totalProcessed = 0;
    const failedLetters = [];

    // Search recipes beginning with each letter
    for (const letter of "abcdefghijklmnopqrstuvwxyz") {
      console.log(`Fetching recipes beginning with ${letter}...`);

      try {
        const response = await fetch(
          `${API_URL}/search.php?f=${letter}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        const meals = data.meals || [];

        for (const meal of meals) {
          if (!meal.strMealThumb || !meal.strInstructions) {
            continue;
          }

          const recipeData = formatRecipe(meal);

          await Recipe.updateOne(
            {
              source: "TheMealDB",
              sourceId: meal.idMeal,
            },
            {
              $set: recipeData,
            },
            {
              upsert: true,
            }
          );

          totalProcessed++;
        }

        console.log(
          `Finished ${letter.toUpperCase()}: ${meals.length} recipes found`
        );

        // Small pause between requests
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`Failed to import letter ${letter}:`, error.message);
        failedLetters.push(letter);
      }
    }

    console.log("--------------------------------");
    console.log("Recipe import completed!");
    console.log(`Total recipes processed: ${totalProcessed}`);

    if (failedLetters.length > 0) {
      console.log("Letters that failed:", failedLetters.join(", "));
    }
  } catch (error) {
    console.error("Import failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

importRecipes();
