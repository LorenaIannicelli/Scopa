const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

//pull in other info that we ned
const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

//
// User schema and model
//

// This is the schema.
const playerStatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    gamesWon: Number,
    gamesLost: Number,
    wonScopas: Number,
    setebellos: Number,
});

const playerStats = mongoose.model("playerStats", playerStatSchema);

//update stats
router.post("/", validUser, async(req, res) => {
    try {
        stats = new playerStats({
            user: req.user,
            gamesWon: 0,
            gamesLost: 0,
            wonScopas: 0,
            setebellos: 0,
        });
        await stats.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.put("/", validUser, async(req, res) => {
    try {
        let stats = await playerStats
            .findOne({
                user: req.user,
            })
            .populate("user");
        if (stats) {
            stats.gamesWon += req.body.gamesWon;
            stats.gamesLost += req.body.gamesLost;
            stats.wonScopas += req.body.wonScopas;
            stats.setebellos += req.body.setebellos;
            await stats.save();
            return res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.get("/", validUser, async(req, res) => {
    try {
        let stats = await playerStats
            .findOne({
                user: req.user,
            })
            .populate("user");
        return res.send({
            playerStats: stats,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

module.exports = {
    model: playerStats,
    routes: router,
};