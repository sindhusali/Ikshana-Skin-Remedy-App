const Remedies = require("../models/Remedy");
const multer = require("multer");

// ✅ Multer Configuration for Image Upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images"); // Store images in public/images
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + "-" + file.fieldname;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// ✅ Get All Remedies
const getRemedies = async (req, res) => {
    try {
        const remedies = await Remedies.find();
        return res.json(remedies);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching remedies" });
    }
};

// ✅ Get Single Remedy by ID
const getRemedy = async (req, res) => {
    try {
        const remedy = await Remedies.findById(req.params.id);
        if (!remedy) return res.status(404).json({ message: "Remedy not found" });
        res.json(remedy);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching remedy" });
    }
};

// ✅ Add a New Remedy
const addRemedy = async (req, res) => {
    console.log(req.user);
    const { remedyName, ingredients, procedure, preparationTime } = req.body;

    // Check for missing fields
    if (!remedyName || !ingredients || !procedure) {
        return res.status(400).json({ message: "Required fields can't be empty" });
    }

    try {
        const newRemedy = await Remedies.create({
            remedyName,
            ingredients,
            procedure,
            preparationTime,
            image: req.file?.filename || "", // Store image filename if provided
            createdBy: req.user.id // Track user who created the remedy
        });

        return res.status(201).json(newRemedy);
    } catch (err) {
        return res.status(500).json({ message: "Error adding remedy" });
    }
};

// ✅ Edit Remedy
const editRemedy = async (req, res) => {
    const { remedyName, ingredients, procedure, preparationTime } = req.body;
    
    try {
        let remedy = await Remedies.findById(req.params.id);
        if (!remedy) return res.status(404).json({ message: "Remedy not found" });

        let image = req.file?.filename ? req.file.filename : remedy.image;

        const updatedRemedy = await Remedies.findByIdAndUpdate(
            req.params.id,
            { remedyName, ingredients, procedure, preparationTime, image },
            { new: true }
        );

        res.json(updatedRemedy);
    } catch (err) {
        return res.status(500).json({ message: "Error updating remedy" });
    }
};

// ✅ Delete Remedy
const deleteRemedy = async (req, res) => {
    try {
        await Remedies.deleteOne({ _id: req.params.id });
        res.json({ status: "ok", message: "Remedy deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting remedy" });
    }
};

module.exports = { getRemedies, getRemedy, addRemedy, editRemedy, deleteRemedy, upload };
