const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors()
);

// Connect database
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Recipe API is running!",
  });
});

// Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const recipeRoutes = require("./routes/recipeRoutes");

// Add this alongside your auth route:
app.use("/api/recipes", recipeRoutes);
