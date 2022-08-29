const express = require("express");
const { registerUser, loginUser, logout, updateProfile, resetPassword, deleteUser, myProfile, getAllUsers } = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/auth");


const router = express.Router();


router.route("/new").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(isAuthenticated, myProfile);
router.route("/update/password").put(isAuthenticated, resetPassword);
router.route("/update/profile").put(isAuthenticated, updateProfile);

router.route("/delete/me").delete(isAuthenticated, deleteUser);

router.route("/logout").get(logout);

//change this later to admin*******************
router.route("/getallusers").get(isAuthenticated, getAllUsers);


module.exports = router;