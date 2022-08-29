const User = require("../models/userModel");
const Note = require("../models/noteModel");

//Register user

exports.registerUser = async(req, res) => {

    try {
        const { name, email, password } = req.body;
        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "req.file.path",
                url: "req.file.path"
            }
        });

        const token = await user.generateToken();
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(201).cookie("token", token, options)
            .json({
                success: true,
                user,
                token
            });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }

}


//Login
exports.loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            // return next(new ErrorHandler("Please enter email & password",400));
            return res.status(400).json({
                success: false,
                message: "Please enter email & password"
            });
        }
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            // return next(new ErrorHandler("Invalid email or password",401));
            return res.status(401).json({
                success: false,
                message: "Please enter correct email & password"
            });
        }

        const isPasswordMatched = await user.comparePassword(password);

        // console.log("ispasswordmatched",isPasswordMatched);

        if (!isPasswordMatched) {

            // return next(new ErrorHandler("Invalid email or password",401));
            return res.status(400).json({
                success: false,
                message: "Please enter correct password"
            });
        }

        const token = await user.generateToken();
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(200).cookie("token", token, options)
            .json({
                success: true,
                user,
                token
            });
    } catch (err) {
        console.log(err);
    }
}

//Forgot password

exports.forgotPassword = async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Please enter correct email"
        });
    }
    res.status(200).json({
        success: true,
        user
    });
}

//Update password

exports.resetPassword = async(req, res) => {

    try {
        const user = await User.findById(req.user._id).select("+password");

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please enter old password & new password"
            });
        }
        const isPasswordMatched = await user.comparePassword(oldPassword);
        console.log(isPasswordMatched);

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Please enter correct old password"
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) {
        console.log(err);
    }
}

//Update user profile
exports.updateProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const { name, email } = req.body;

        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }

        await user.save();

        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


//logout user

exports.logout = async(req, res) => {

    try {
        res.status(200).cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        }).json({
            success: true,
            message: "Logged out"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }

}

//Delete user

exports.deleteUser = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const notes = user.notes;

        await user.remove();
        res.status(200).cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });

        //Delete all notes of user
        for (let i = 0; i < notes.length; i++) {
            await Note.findByIdAndDelete(notes[i]._id);
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

//my profile

exports.myProfile = async(req, res) => {

    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

//get all users
exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}