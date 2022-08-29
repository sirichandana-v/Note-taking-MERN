const express = require("express");
const { getAllNotes, createNote, deleteNote, updateNote } = require("../controllers/noteController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/notes").get(isAuthenticated, getAllNotes);
router.route("/note/upload").post(isAuthenticated, createNote);
router.route("/note/:id").delete(deleteNote).put(updateNote);


module.exports = router;