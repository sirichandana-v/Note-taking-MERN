const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 5 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your Email"],
        unique: true,
        // validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your Password"],
        minLength: [8, "Name should have more than 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },

    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
    }]

});

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {

    console.log("candidatePassword", candidatePassword);
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.generateToken = async function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
}


module.exports = mongoose.model("User", userSchema);