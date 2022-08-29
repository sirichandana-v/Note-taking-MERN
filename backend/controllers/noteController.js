const Note = require("../models/noteModel");
const User = require("../models/userModel");


//All notes
exports.getAllNotes = async(req, res) => {

    const notes = await Note.find();
    res.status(200).json({ success: true, notes });
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

    let note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }

    console.log(req.body);
    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    }).then((note) => {
        console.log(note);
    });

    res.status(200).json({
        success: true,
        note,
    });
}

//Delete Note

exports.deleteNote = async(req, res) => {

    const note = await Note.findById(req.params.id);
    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }
    await note.remove();
    res.status(200).json({ success: true });
}