const User = require("../models/userModel");

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

//Reset password

exports.resetPassword = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
}