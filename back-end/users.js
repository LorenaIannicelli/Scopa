const express = require("express");
const mongoose = require("mongoose");
const argon2 = require("argon2");

// const playerStatsSchema = require("./playerStats.js");
// const playerStats = playerStatsSchema.model;

const router = express.Router();

//
// User schema and model
//

// This is the schema. Users have usernames and passwords. We solemnly promise to
// salt and hash the password!
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    profilePath: String,
});

// Configure multer so that it will upload to '/public/images'
const multer = require("multer");
const upload = multer({
    dest: "../front-end/public/images/",
    limits: {
        fileSize: 50000000,
    },
});

// This is a hook that will be called before a user record is saved,
// allowing us to be sure to salt and hash the password first.
userSchema.pre("save", async function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();

    try {
        // generate a hash. argon2 does the salting and hashing for us
        const hash = await argon2.hash(this.password);
        // override the plaintext password with the hashed one
        this.password = hash;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// This is a method that we can call on User objects to compare the hash of the
// password the browser sends with the has of the user's true password stored in
// the database.
userSchema.methods.comparePassword = async function(password) {
    try {
        // note that we supply the hash stored in the database (first argument) and
        // the plaintext password. argon2 will do the hashing and salting and
        // comparison for us.
        const isMatch = await argon2.verify(this.password, password);
        return isMatch;
    } catch (error) {
        return false;
    }
};

// This is a method that will be called automatically any time we convert a user
// object to JSON. It deletes the password hash from the object. This ensures
// that we never send password hashes over our API, to avoid giving away
// anything to an attacker.
userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};

// create a User model from the User schema
const User = mongoose.model("User", userSchema);

/* Middleware */

// middleware function to check for logged-in users
const validUser = async(req, res, next) => {
    if (!req.session.userID)
        return res.status(403).send({
            message: "not logged in",
        });
    try {
        const user = await User.findOne({
            _id: req.session.userID,
        });
        if (!user) {
            return res.status(403).send({
                message: "not logged in",
            });
        }
        // set the user field in the request
        req.user = user;
    } catch (error) {
        // Return an error if user does not exist.
        return res.status(403).send({
            message: "not logged in",
        });
    }

    // if everything succeeds, move to the next middleware
    next();
};

/* API Endpoints */

// create a new user
router.post("/", async(req, res) => {
    // Make sure that the form coming from the browser includes all required fields,
    // otherwise return an error. A 400 error means the request was
    // malformed.
    if (!req.body.firstName ||
        !req.body.lastName ||
        !req.body.username ||
        !req.body.password
    )
        return res.status(400).send({
            message: "first name, last name, username and password are required",
        });

    try {
        //  Check to see if username already exists and if not send a 403 error. A 403
        // error means permission denied.
        const existingUser = await User.findOne({
            username: req.body.username,
        });
        if (existingUser)
            return res.status(403).send({
                message: "username already exists",
            });
        // create a new user and save it to the database
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            profilePath: "",
        });
        await user.save();

        // set user session info
        req.session.userID = user._id;

        // send back a 200 OK response, along with the user that was created
        return res.send({
            user: user,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// login a user
router.post("/login", async(req, res) => {
    // Make sure that the form coming from the browser includes a username and a
    // password, otherwise return an error.
    if (!req.body.username || !req.body.password) return res.sendStatus(400);

    try {
        //  lookup user record
        const user = await User.findOne({
            username: req.body.username,
        });
        // Return an error if user does not exist.
        if (!user)
            return res.status(403).send({
                message: "username or password is wrong",
            });

        // Return the SAME error if the password is wrong. This ensure we don't
        // leak any information about which users exist.
        if (!(await user.comparePassword(req.body.password)))
            return res.status(403).send({
                message: "username or password is wrong",
            });

        // set user session info
        req.session.userID = user._id;

        return res.send({
            user: user,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// upload profile picture
router.put(
    "/profilePic",
    validUser,
    upload.single("photo"),
    async(req, res) => {
        // check parameters
        if (!req.file)
            return res.status(400).send({
                message: "Must upload a file.",
            });
        user = req.user;

        user.profilePath = "/images/" + req.file.filename;
        await user.save();

        try {
            res.send({ path: user.profilePath });
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }
);

// get logged in user
router.get("/", validUser, async(req, res) => {
    try {
        res.send({
            user: req.user,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// logout
router.delete("/", validUser, async(req, res) => {
    try {
        req.session = null;
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

//
router.delete("/profilePic", validUser, async(req, res) => {
    try {
        user = req.user;
        user.profilePath = "";
        await user.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    routes: router,
    model: User,
    valid: validUser,
};