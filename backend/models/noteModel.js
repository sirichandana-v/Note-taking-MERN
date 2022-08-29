const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "please enter note title"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "please enter note description"],
    },
    category: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("Note", noteSchema);