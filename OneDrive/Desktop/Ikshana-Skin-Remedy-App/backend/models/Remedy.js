const mongoose = require("mongoose");

const remedySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Skin Care",
        "Hair Care",
        "Eye Care",
        "Lip Care",
        "Dental & Oral Care",
        "Nail Care"
      ]
    },
    image: {
      type: String // Stores the filename of the image
    },
    ingredients: {
      type: [String], // ✅ Store ingredients as an array of strings
      required: true
    },
    preparation: {
      type: String,
      required: true
    },
    application: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Remedies", remedySchema);
