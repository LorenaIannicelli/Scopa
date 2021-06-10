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
        console.log(req.user);
        let stats = await playerStats
            .findOne({
                user: req.user,
            })
            .populate("user");
        console.log(stats);
        if (stats) {
            let gamesWon = stats.gamesWon;
            let gamesLost = stats.gamesLost;
            let wonScopas = stats.wonScopas;
            let setebellos = stats.setebellos;
            stats = {
                user: req.user,
                gamesWon: gamesWon + req.body.gamesWon,
                gamesLost: gamesLost + req.body.gamesLost,
                wonScopas: wonScopas + req.body.wonScopas,
                setebellos: setebellos + req.body.setebellos,
            };

            await stats.save();
            return res.sendStatus(200);
        } else {
            stats = new playerStats({
                user: req.user,
                gamesWon: req.body.gamesWon,
                gamesLost: req.body.gamesLost,
                wonScopas: req.body.wonScopas,
                setebellos: req.body.setebellos,
            });
            await stats.save();
            return res.sendStatus(200);
        }
        return res.sendStatus(500);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.get("/", validUser, async(req, res) => {
    try {
        let stats = await playerStats
            .find({
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