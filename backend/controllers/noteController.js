const Note = require("../models/noteModel");
const User = require("../models/userModel");


//All notes of logged in user
exports.getAllNotes = async(req, res) => {

    try {
        const notes = await Note.find({ owner: req.user._id });
        res.status(200).json({ success: true, notes });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

//Create Note

exports.createNote = async(req, res) => {
    try {
        const newNote = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            owner: req.user._id

        }
        const note = await Note.create(newNote);

        const user = await User.findById(req.user._id);
        user.notes.push(note._id);

        await user.save();

        res.status(201).json({
            success: true,
            note
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}



//Update Note
exports.updateNote = async(req, res) => {
    try {
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to update this note" });
        }

        note = await Note.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            note,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

//Delete Note

exports.deleteNote = async(req, res) => {

    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this note" });
        }

        const user = await User.findById(req.user._id);
        const index = user.notes.indexOf(req.params.id);
        user.notes.splice(index, 1);
        await user.save();

        await note.remove();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}