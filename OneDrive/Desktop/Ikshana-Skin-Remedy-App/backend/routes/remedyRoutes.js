const express = require("express");
const Remedies = require("../models/Remedy");
const verifyToken = require("../middleware/auth");

const router = express.Router();
const multer = require("multer");

// ✅ Configure Multer Storage (Saves images to "uploads/" folder)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // ✅ Store in "uploads/" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // ✅ Unique filenames
    }
});

// ✅ Initialize Multer with Storage
const upload = multer({ storage });


router.get("/search", async (req, res) => {
    try {
        let { category } = req.query;
        if (!category) {
            return res.status(400).json({ message: "Category is required." });
        }

        // ✅ Fetch all remedies to check stored categories
        const allRemedies = await Remedies.find({}, { category: 1, _id: 0 });
        console.log("Stored Categories in Database:", allRemedies.map(r => r.category));

        // ✅ Normalize category (case-insensitive search)
        const validCategories = [
            "Skin Care",
            "Hair Care",
            "Eye Care",
            "Lip Care",
            "Dental & Oral Care",
            "Nail Care"
        ];
        const matchedCategory = validCategories.find(cat => cat.toLowerCase() === category.toLowerCase());

        if (!matchedCategory) {
            console.log(`Invalid category: ${category}`);
            return res.status(400).json({ message: "Invalid category." });
        }

        // ✅ Perform case-insensitive search using `$regex`
        console.log(`Searching for remedies in category: ${matchedCategory}`);

        const remedies = await Remedies.find({
            category: { $regex: new RegExp(`^${matchedCategory}$`, "i") } // Case-insensitive search
        });

        console.log("Backend Remedies Found:", remedies); // Debugging log
        res.json(remedies);
    } catch (err) {
        console.error("Error fetching remedies by category:", err);
        return res.status(500).json({ message: "Error fetching remedies", error: err.message });
    }
});


// ✅ Get All Remedies
router.get("/", async (req, res) => {
    try {
        const remedies = await Remedies.find();
        return res.json(remedies);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching remedies", error: err.message });
    }
});

// ✅ FIX: `/search` must be before `/:id` to avoid ObjectId error
router.get("/:id", async (req, res) => {
    try {
        const remedy = await Remedies.findById(req.params.id);
        if (!remedy) return res.status(404).json({ message: "Remedy not found" });
        res.json(remedy);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching remedy", error: err.message });
    }
});

// ✅ Get Remedies by User ID (Requires Authentication)
router.get("/user/:userId", verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const remedies = await Remedies.find({ createdBy: userId });

        if (!remedies.length) {
            return res.status(404).json({ message: "No remedies found for this user" });
        }

        res.json(remedies);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching user remedies", error: err.message });
    }
});

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
    console.log("Incoming Remedy Data:", req.body);
    console.log("Uploaded File:", req.file); // ✅ Check file upload

    let { title, category, ingredients, preparation, application } = req.body;

    if (!title || !category || !ingredients || !preparation || !application) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Convert ingredients back to an array if received as a JSON string
    try {
        ingredients = JSON.parse(ingredients);
        if (!Array.isArray(ingredients) || !ingredients.every(ing => typeof ing === "string")) {
            return res.status(400).json({ message: "Ingredients must be an array of strings" });
        }
    } catch (err) {
        return res.status(400).json({ message: "Invalid ingredients format" });
    }

    try {
        const newRemedy = new Remedies({
            title,
            category,
            ingredients,
            preparation,
            application,
            image: req.file ? req.file.filename : null, // ✅ Save filename if image is uploaded
            createdBy: req.user.id, // ✅ Ensure the user ID is assigned
        });

        await newRemedy.save();
        console.log("Remedy Added Successfully:", newRemedy);

        return res.status(201).json({ message: "Remedy added successfully!", remedy: newRemedy });
    } catch (err) {
        console.error("Error adding remedy:", err);
        return res.status(500).json({ message: "Error adding remedy", error: err.message });
    }
});



// ✅ Edit Remedy (Requires Authentication)
router.put("/:id", verifyToken, async (req, res) => {
    const { title, category, ingredients, preparation, application } = req.body;

    // ❌ Ensure ingredients is an array of strings
    if (ingredients && (!Array.isArray(ingredients) || !ingredients.every(ing => typeof ing === "string"))) {
        return res.status(400).json({ message: "Ingredients must be an array of strings" });
    }

    try {
        let remedy = await Remedies.findById(req.params.id);
        if (!remedy) return res.status(404).json({ message: "Remedy not found" });

        // ✅ Trim ingredient names
        const formattedIngredients = ingredients ? ingredients.map(ing => ing.trim()) : remedy.ingredients;

        const updatedRemedy = await Remedies.findByIdAndUpdate(
            req.params.id,
            { title, category, ingredients: formattedIngredients, preparation, application },
            { new: true }
        );

        res.json({ message: "Remedy updated successfully!", remedy: updatedRemedy });
    } catch (err) {
        return res.status(500).json({ message: "Error updating remedy", error: err.message });
    }
});

// ✅ Delete Remedy (Requires Authentication)
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await Remedies.findByIdAndDelete(req.params.id);
        res.json({ message: "Remedy deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting remedy", error: err.message });
    }
});

module.exports = router;
