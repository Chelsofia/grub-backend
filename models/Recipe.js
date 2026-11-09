
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        image: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            trim: true,
            default: "Other",
        },

        area: {
            type: String,
            trim: true,
            default: "",
        },

        ingredients: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true,
                },
                measure: {
                    type: String,
                    trim: true,
                    default: "",
                },
            },
        ],

        instructions: {
            type: String,
            required: true,
        },
        youtubeUrl: {
            type: String,
            default: "",
        },

        tags: {
            type: [String],
            default: [],
        },

        source: {
            type: String,
            enum: ["TheMealDB", "Grub"],
            default: "Grub",
        },

        sourceId: {
            type: String,
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

// Prevent importing the same TheMealDB recipe twice.
recipeSchema.index(
    { source: 1, sourceId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            sourceId: { $type: "string" },
        },
    }
);

module.exports = mongoose.model("Recipe", recipeSchema);
